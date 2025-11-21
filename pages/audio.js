// pages/audio.js
import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AudioSilenceRemover() {
  const [originalAudio, setOriginalAudio] = useState(null);
  const [processedAudio, setProcessedAudio] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState(['Ready to process audio...']);
  const [fileName, setFileName] = useState('');
  
  const fileInputRef = useRef(null);
  const originalAudioRef = useRef(null);
  const processedAudioRef = useRef(null);

  const log = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [logEntry, ...prev.slice(0, 49)]);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setOriginalAudio(url);
    
    log(`📁 Loaded: ${file.name} (${formatFileSize(file.size)})`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const encodeWAV = (samples, sampleRate) => {
    let buffer = new ArrayBuffer(44 + samples.length * 2);
    let view = new DataView(buffer);

    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      let s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  const removeSilence = async (audioBuffer, threshold, minDuration) => {
    const channel = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const minSamples = (minDuration / 1000) * sampleRate;

    let output = [];
    let isSilent = true;
    let silentCount = 0;
    let silenceSegments = 0;
    let totalSilenceSamples = 0;

    const totalSamples = channel.length;
    const updateInterval = Math.floor(totalSamples / 100);

    for (let i = 0; i < channel.length; i++) {
      const v = Math.abs(channel[i]);

      if (v < threshold) {
        silentCount++;
        if (!isSilent && silentCount > minSamples) {
          isSilent = true;
          silenceSegments++;
          log(`🔇 Silence detected at ${formatTime(i / sampleRate)}`);
        }
      } else {
        if (isSilent) {
          totalSilenceSamples += silentCount;
        }
        silentCount = 0;
        isSilent = false;
      }

      if (!isSilent) {
        output.push(channel[i]);
      }

      // Update progress 
      if (i % updateInterval === 0) {
        const progress = 30 + (i / channel.length) * 50;
        setProgress(progress);
      }
    }

    if (isSilent) {
      totalSilenceSamples += silentCount;
    }

    log(`📊 Original: ${channel.length.toLocaleString()} samples`);
    log(`📊 Output: ${output.length.toLocaleString()} samples`);
    log(`🔇 Removed ${silenceSegments} silence segments`);

    return { 
      samples: new Float32Array(output), 
      sampleRate,
      originalLength: channel.length,
      processedLength: output.length,
      silenceSegments,
      totalSilenceSamples
    };
  };

  const processAudio = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      alert("Please select an audio file first");
      return;
    }

    const threshold = parseFloat(document.getElementById('threshold')?.value || 0.02);
    const minDur = parseInt(document.getElementById('minDur')?.value || 150);

    if (threshold < 0.001 || threshold > 0.1) {
      alert("Threshold must be between 0.001 and 0.1");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      log("🔄 Processing audio...");
      setProgress(30);

      const result = await removeSilence(audioBuffer, threshold, minDur);
      setProgress(80);

      const wavBlob = encodeWAV(result.samples, result.sampleRate);
      const url = URL.createObjectURL(wavBlob);

      setProgress(100);
      setProcessedAudio(url);

      // Calculate statistics
      const originalDuration = audioBuffer.duration;
      const processedDuration = result.samples.length / result.sampleRate;
      const silenceRemoved = ((result.totalSilenceSamples / result.originalLength) * 100).toFixed(1);

      setStats({
        originalDuration: formatTime(originalDuration),
        processedDuration: formatTime(processedDuration),
        silenceRemoved: `${silenceRemoved}%`,
        fileSize: formatFileSize(wavBlob.size),
        downloadUrl: url
      });

      log(`✅ Processing complete!`);
      log(`⏱️ Original: ${formatTime(originalDuration)} → Processed: ${formatTime(processedDuration)}`);
      log(`📉 Removed ${silenceRemoved}% silence`);

    } catch (error) {
      log(`❌ Error: ${error.message}`);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.background = '#e0f2fe';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.style.background = '#f1f5f9';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.background = '#f1f5f9';
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('audio/')) {
      fileInputRef.current.files = files;
      handleFileSelect({ target: fileInputRef.current });
    }
  };

  return (
    <>
      <Head>
        <title>Audio Silence Remover | Free Offline Tool - FileOptimizeTools</title>
        <meta 
          name="description" 
          content="Remove silence from audio files completely offline. No data leaves your browser. Free and easy to use audio silence removal tool." 
        />
        <meta 
          name="keywords" 
          content="audio silence remover, remove silence from audio, offline audio tool, audio processing, web audio api, free audio tool, silence removal" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Audio Silence Remover | Free Offline Tool - FileOptimizeTools" />
        <meta property="og:description" content="Remove silence from audio files completely offline. No data leaves your browser. Free and easy to use." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fileoptimizetools.com/audio" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Audio Silence Remover | Free Offline Tool" />
        <meta name="twitter:description" content="Remove silence from audio files completely offline. No data leaves your browser." />
      </Head>
      
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" passHref>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}>
              <span style={{
                fontSize: '1.8rem',
                fontWeight: 'bold'
              }}>
                🛠️ FileOptimizeTools
              </span>
            </div>
          </Link>
          
          <nav style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <Link href="/" passHref>
              <span style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }} onMouseOver={(e) => e.target.style.opacity = '0.8'} onMouseOut={(e) => e.target.style.opacity = '1'}>
                Home
              </span>
            </Link>
            <Link href="/audio" passHref>
              <span style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.2)',
                padding: '8px 16px',
                borderRadius: '20px'
              }}>
                Audio Tools
              </span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '2rem 0'
      }}>
        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          padding: '0 2rem'
        }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '2rem' }}>
            <Link href="/" passHref>
              <span style={{
                color: '#64748b',
                textDecoration: 'none',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                Home
              </span>
            </Link>
            <span style={{ color: '#64748b', margin: '0 8px' }}>/</span>
            <span style={{ color: '#2563eb', fontSize: '0.9rem', fontWeight: '500' }}>
              Audio Silence Remover
            </span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ 
              color: '#1e293b',
              marginBottom: '1rem',
              fontSize: '2.5rem',
              fontWeight: '700'
            }}>
              🎵 Audio Silence Remover
            </h1>
            <p style={{
              color: '#64748b',
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Remove silence from audio files completely offline. No data leaves your browser - 100% private and secure.
            </p>
          </div>

          {/* Tool Card */}
          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            marginBottom: '2rem'
          }}>
            {/* File Input */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '1rem', 
                fontWeight: '600',
                color: '#1e293b',
                fontSize: '1.1rem'
              }}>
                📁 Select Audio File
              </label>
              <div 
                style={{
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '20px',
                    background: '#f8fafc',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1.1rem'
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span>📎 Choose Audio File or Drag & Drop</span>
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="audio/*"
                  onChange={handleFileSelect}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                />
              </div>
              {fileName && (
                <div style={{ 
                  marginTop: '1rem', 
                  color: '#059669',
                  background: '#d1fae5',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #a7f3d0',
                  fontSize: '1rem'
                }}>
                  ✅ Selected: {fileName}
                </div>
              )}
            </div>

            {/* Settings */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: '#1e293b',
                  fontSize: '1rem'
                }}>
                  🎚️ Silence Threshold (0.001 - 0.1)
                </label>
                <input 
                  id="threshold"
                  type="number" 
                  defaultValue="0.02"
                  step="0.001"
                  min="0.001"
                  max="0.1"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <small style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem', display: 'block' }}>
                  Lower values = more sensitive to silence detection
                </small>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: '#1e293b',
                  fontSize: '1rem'
                }}>
                  ⏱️ Minimum Silence (ms)
                </label>
                <input 
                  id="minDur"
                  type="number" 
                  defaultValue="150"
                  min="50"
                  max="5000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <small style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem', display: 'block' }}>
                  Shorter silence periods won't be removed
                </small>
              </div>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div style={{
                width: '100%',
                height: '8px',
                background: '#f1f5f9',
                borderRadius: '4px',
                overflow: 'hidden',
                margin: '2rem 0'
              }}>
                <div 
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                    width: `${progress}%`,
                    transition: 'width 0.3s ease',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}

            {/* Process Button */}
            <button
              onClick={processAudio}
              disabled={isProcessing || !fileName}
              style={{
                width: '100%',
                padding: '16px',
                background: isProcessing ? '#94a3b8' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: isProcessing ? 'none' : '0 4px 15px rgba(37, 99, 235, 0.3)'
              }}
              onMouseOver={(e) => {
                if (!isProcessing && fileName) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isProcessing && fileName) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                }
              }}
            >
              {isProcessing ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Processing Audio...
                </>
              ) : (
                '⚡ Process Audio'
              )}
            </button>
          </div>

          {/* Statistics */}
          {stats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #bae6fd',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0369a1', marginBottom: '0.5rem' }}>
                  {stats.originalDuration}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                  Original Duration
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #a7f3d0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669', marginBottom: '0.5rem' }}>
                  {stats.processedDuration}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                  Processed Duration
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #fcd34d',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706', marginBottom: '0.5rem' }}>
                  {stats.silenceRemoved}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                  Silence Removed
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #fca5a5',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626', marginBottom: '0.5rem' }}>
                  {stats.fileSize}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                  File Size
                </div>
              </div>
            </div>
          )}

          {/* Audio Players */}
          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            marginBottom: '2rem'
          }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ 
                color: '#1e293b', 
                marginBottom: '1.5rem',
                fontSize: '1.5rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.8rem' }}>🎧</span>
                Original Audio
              </h3>
              {originalAudio && (
                <audio 
                  ref={originalAudioRef}
                  src={originalAudio} 
                  controls 
                  style={{ 
                    width: '100%',
                    borderRadius: '12px',
                    background: '#f8fafc'
                  }}
                />
              )}
            </div>
          
            <div>
              <h3 style={{ 
                color: '#1e293b', 
                marginBottom: '1.5rem',
                fontSize: '1.5rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.8rem' }}>✨</span>
                Processed Audio
              </h3>
              {processedAudio && (
                <>
                  <audio 
                    ref={processedAudioRef}
                    src={processedAudio} 
                    controls 
                    style={{ 
                      width: '100%', 
                      marginBottom: '1.5rem',
                      borderRadius: '12px',
                      background: '#f8fafc'
                    }}
                  />
                  <a 
                    href={stats?.downloadUrl}
                    download={`silence_removed_${Date.now()}.wav`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 28px',
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.3)';
                    }}
                  >
                    💾 Download Processed Audio
                  </a>
                </>
              )}
            </div>
          </div>
                
          {/* Logs */}
          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              color: '#1e293b', 
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '1.8rem' }}>📊</span>
              Processing Log
            </h3>
            <div style={{
              background: '#1e293b',
              color: '#10b981',
              padding: '1.5rem',
              borderRadius: '12px',
              fontFamily: 'Courier New, monospace',
              fontSize: '14px',
              height: '250px',
              overflowY: 'auto',
              border: '1px solid #374151'
            }}>
              {logs.map((log, index) => (
                <div key={index} style={{ 
                  marginBottom: '0.75rem',
                  lineHeight: '1.4',
                  borderBottom: index < logs.length - 1 ? '1px solid #374151' : 'none',
                  paddingBottom: index < logs.length - 1 ? '0.75rem' : '0'
                }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        padding: '3rem 0 2rem',
        marginTop: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#fbbf24'
              }}>
                🛠️ FileOptimizeTools
              </h3>
              <p style={{
                color: '#cbd5e1',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                Free, fast, and secure file optimization tools that work completely in your browser. 
                No uploads, no data sharing, 100% private.
              </p>
            </div>
            
            <div>
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'white'
              }}>
                Quick Links
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <Link href="/" passHref>
                  <span style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    fontSize: '1rem'
                  }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                    Home
                  </span>
                </Link>
                <Link href="/audio" passHref>
                  <span style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    fontSize: '1rem'
                  }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                    Audio Tools
                  </span>
                </Link>
              </div>
            </div>
            
            <div>
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'white'
              }}>
                Features
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                color: '#cbd5e1',
                fontSize: '1rem'
              }}>
                <div>🔒 100% Offline Processing</div>
                <div>⚡ No File Uploads</div>
                <div>🎯 Fast & Efficient</div>
                <div>💾 Privacy First</div>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid #475569',
            paddingTop: '2rem',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '0.9rem'
          }}>
            <p>© 2024 FileOptimizeTools. All rights reserved. Made with ❤️ for the open web.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          div > div {
            grid-template-columns: 1fr;
          }
          
          header > div {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          nav {
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}
