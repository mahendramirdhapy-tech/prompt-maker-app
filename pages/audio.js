// pages/audio.js - CORRECTED VERSION
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function AudioSilenceRemover() {
  const [user, setUser] = useState(null);
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

  // Auth functions
  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    initializeAuth();
  }, []);

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
        <title>Audio Silence Remover | AI Prompt Maker</title>
        <meta 
          name="description" 
          content="Remove silence from audio files completely offline. No data leaves your browser. Free and easy to use audio silence removal tool." 
        />
      </Head>

      <Layout user={user} handleLogin={handleLogin} handleLogout={handleLogout}>
        {/* ONLY AUDIO TOOL SPECIFIC CONTENT */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '1rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Page Header */}
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
              Remove silence from audio files completely offline. No data leaves your browser.
            </p>
          </div>

          {/* Main Audio Tool Content */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.5rem',
            border: '1px solid #e2e8f0'
          }}>
            {/* File Input Section */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600', 
                color: '#1e293b',
                fontSize: '1.1rem'
              }}>
                📁 Select Audio File
              </label>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '20px 16px',
                    background: '#f8fafc',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '1rem'
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
                  marginTop: '0.5rem', 
                  color: '#64748b',
                  fontSize: '0.9rem'
                }}>
                  ✅ Selected: {fileName}
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div style={{ 
              marginBottom: '2rem',
              padding: '1.5rem',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>⚙️ Processing Settings</h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Silence Threshold
                  </label>
                  <input 
                    id="threshold"
                    type="number" 
                    step="0.001"
                    min="0.001"
                    max="0.1"
                    defaultValue="0.02"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Lower = more sensitive (0.001-0.1)
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Min Silence Duration (ms)
                  </label>
                  <input 
                    id="minDur"
                    type="number" 
                    min="50"
                    max="1000"
                    defaultValue="150"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Shorter pauses won't be removed
                  </div>
                </div>
              </div>

              <button 
                onClick={processAudio}
                disabled={isProcessing || !originalAudio}
                style={{
                  padding: '12px 24px',
                  background: isProcessing || !originalAudio ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isProcessing || !originalAudio ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  width: '100%',
                  transition: 'all 0.2s'
                }}
              >
                {isProcessing ? '🔄 Processing...' : '🚀 Remove Silence'}
              </button>

              {/* Progress Bar */}
              {isProcessing && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                      transition: 'width 0.3s ease',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '0.5rem', 
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    {Math.round(progress)}% Complete
                  </div>
                </div>
              )}
            </div>

            {/* Audio Players */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* Original Audio */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>🎵 Original Audio</h4>
                {originalAudio ? (
                  <audio 
                    ref={originalAudioRef}
                    controls 
                    src={originalAudio}
                    style={{ width: '100%' }}
                  />
                ) : (
                  <div style={{
                    padding: '2rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    No audio loaded
                  </div>
                )}
              </div>

              {/* Processed Audio */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>🎯 Processed Audio</h4>
                {processedAudio ? (
                  <div>
                    <audio 
                      ref={processedAudioRef}
                      controls 
                      src={processedAudio}
                      style={{ width: '100%', marginBottom: '1rem' }}
                    />
                    {stats && (
                      <a 
                        href={stats.downloadUrl}
                        download={`processed_${fileName || 'audio.wav'}`}
                        style={{
                          display: 'inline-block',
                          padding: '8px 16px',
                          background: '#10b981',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        💾 Download Processed Audio
                      </a>
                    )}
                  </div>
                ) : (
                  <div style={{
                    padding: '2rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    Processed audio will appear here
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            {stats && (
              <div style={{ 
                marginBottom: '2rem',
                padding: '1.5rem',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#166534' }}>📊 Processing Results</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Original Duration</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>{stats.originalDuration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Processed Duration</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>{stats.processedDuration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Silence Removed</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#dc2626' }}>{stats.silenceRemoved}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>File Size</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>{stats.fileSize}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Logs */}
            <div>
              <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>📝 Processing Log</h4>
              <div style={{
                height: '200px',
                overflowY: 'auto',
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '1rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: '1.4'
              }}>
                {logs.map((log, index) => (
                  <div key={index} style={{ marginBottom: '0.25rem' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div style={{
            background: '#f8fafc',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>ℹ️ About This Tool</h3>
            <div style={{ color: '#64748b', lineHeight: '1.6' }}>
              <p><strong>🔒 Privacy First:</strong> All processing happens in your browser. No audio data is uploaded to any server.</p>
              <p><strong>⚡ Fast Processing:</strong> Uses Web Audio API for efficient silence detection and removal.</p>
              <p><strong>🎯 Smart Detection:</strong> Configurable threshold and minimum silence duration for precise control.</p>
              <p><strong>💾 WAV Output:</strong> Processed audio is exported in high-quality WAV format.</p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
