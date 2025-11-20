// pages/audio.js
import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdsComponent from '../components/AdsComponent';

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
        <title>Audio Silence Remover | Free Offline Tool</title>
        <meta 
          name="description" 
          content="Remove silence from audio files completely offline. No data leaves your browser. Free and easy to use." 
        />
        <meta 
          name="keywords" 
          content="audio silence remover, remove silence from audio, offline audio tool, audio processing, web audio api" 
        />
      </Head>
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* Back to Home Button */}
        <Link href="/" passHref>
          <button
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              padding: '8px 16px',
              backgroundColor: '#64748b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#475569';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#64748b';
            }}
          >
            ← Back to Home
          </button>
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: '#2563eb',
            marginBottom: '0.5rem',
            fontSize: '2.25rem'
          }}>
            🎵 Audio Silence Remover
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '1.125rem'
          }}>
            Completely offline tool - No data leaves your browser
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}>
          {/* File Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#1e293b'
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
                  gap: '8px',
                  padding: '12px 16px',
                  background: '#f1f5f9',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
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
              <div style={{ marginTop: '0.5rem', color: '#64748b' }}>
                Selected: {fileName}
              </div>
            )}
          </div>

          {/* Settings */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#1e293b'
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
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
              <small style={{ color: '#64748b' }}>Lower = more sensitive</small>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#1e293b'
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
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
              <small style={{ color: '#64748b' }}>Shorter pauses won't be removed</small>
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div style={{
              width: '100%',
              height: '6px',
              background: '#e2e8f0',
              borderRadius: '3px',
              overflow: 'hidden',
              margin: '1rem 0'
            }}>
              <div 
                style={{
                  height: '100%',
                  background: '#2563eb',
                  width: `${progress}%`,
                  transition: 'width 0.3s ease'
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
              padding: '12px',
              background: isProcessing ? '#94a3b8' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isProcessing ? '⏳ Processing...' : '⚡ Process Audio'}
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center',
              borderLeft: '4px solid #2563eb'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' }}>
                {stats.originalDuration}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                Original Duration
              </div>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                {stats.processedDuration}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                Processed Duration
              </div>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                {stats.silenceRemoved}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                Silence Removed
              </div>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center',
              borderLeft: '4px solid #ef4444'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
                {stats.fileSize}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                File Size
              </div>
            </div>
          </div>
        )}

        {/* Audio Players */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#2563eb', marginBottom: '1rem' }}>🎧 Original Audio</h3>
            {originalAudio && (
              <audio 
                ref={originalAudioRef}
                src={originalAudio} 
                controls 
                style={{ width: '100%' }}
              />
            )}
          </div>
        
          <div>
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>✨ Processed Audio</h3>
            {processedAudio && (
              <>
                <audio 
                  ref={processedAudioRef}
                  src={processedAudio} 
                  controls 
                  style={{ width: '100%', marginBottom: '1rem' }}
                />
                <a 
                  href={stats?.downloadUrl}
                  download={`silence_removed_${Date.now()}.wav`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#10b981',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: '600'
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
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>📊 Processing Log</h3>
          <div style={{
            background: '#1e293b',
            color: '#10b981',
            padding: '1rem',
            borderRadius: '8px',
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            height: '200px',
            overflowY: 'auto'
          }}>
            {logs.map((log, index) => (
              <div key={index} style={{ marginBottom: '0.5rem' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
 <script
    dangerouslySetInnerHTML={{
      __html: `
        // Push Ads
        var script1 = document.createElement('script');
        script1.src = 'https://3nbf4.com/act/files/tag.min.js?z=10209677';
        script1.setAttribute('data-cfasync', 'false');
        script1.async = true;
        document.head.appendChild(script1);
        
        // Native Ads  
        var script2 = document.createElement('script');
        script2.innerHTML = '(function(s){s.dataset.zone="10209689",s.src="https://nap5k.com/tag.min.js"})(document.createElement("script"));';
        document.head.appendChild(script2);
        
        // Interstitial Ads
        var script3 = document.createElement('script');
        script3.innerHTML = '(function(s){s.dataset.zone="10209722",s.src="https://groleegni.net/vignette.min.js"})(document.createElement("script"));';
        document.head.appendChild(script3);
        
        // New Interstitial Ads
        var script4 = document.createElement('script');
        script4.innerHTML = '(function(s){s.dataset.zone="10212308",s.src="https://gizokraijaw.net/vignette.min.js"})(document.createElement("script"));';
        document.head.appendChild(script4);
      `,
    }}
  />


            
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div > div {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
