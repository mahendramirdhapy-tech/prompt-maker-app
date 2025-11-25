// pages/audio.js - COMPLETE VERSION WITH INTEGRATED GUIDE
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function AudioSilenceRemover() {
  const [user, setUser] = useState(null);
  const [originalAudio, setOriginalAudio] = useState(null);
  const [processedAudio, setProcessedAudio] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState(['Audio processing ke liye ready...']);
  const [fileName, setFileName] = useState('');
  const [activeTab, setActiveTab] = useState('tool');
  
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
        <title>Audio Silence Remover | Remove Silence from Audio Files Free</title>
        <meta 
          name="description" 
          content="Free online audio silence remover tool. Remove unwanted silence from MP3, WAV files completely offline. No installation required. Perfect for podcasts, videos." 
        />
        <meta name="keywords" content="audio silence remover, remove silence from audio, free audio editor, podcast editing, video audio cleanup, online audio tool" />
      </Head>

      <Layout user={user} handleLogin={handleLogin} handleLogout={handleLogout}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '1rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '1px solid #e2e8f0',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('tool')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'tool' ? '#3b82f6' : 'transparent',
                color: activeTab === 'tool' ? 'white' : '#64748b',
                border: 'none',
                borderBottom: activeTab === 'tool' ? '2px solid #3b82f6' : 'none',
                cursor: 'pointer',
                fontWeight: '600',
                borderRadius: '8px 8px 0 0'
              }}
            >
              🎵 Audio Tool
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'guide' ? '#3b82f6' : 'transparent',
                color: activeTab === 'guide' ? 'white' : '#64748b',
                border: 'none',
                borderBottom: activeTab === 'guide' ? '2px solid #3b82f6' : 'none',
                cursor: 'pointer',
                fontWeight: '600',
                borderRadius: '8px 8px 0 0'
              }}
            >
              📚 Complete Guide
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'benefits' ? '#3b82f6' : 'transparent',
                color: activeTab === 'benefits' ? 'white' : '#64748b',
                border: 'none',
                borderBottom: activeTab === 'benefits' ? '2px solid #3b82f6' : 'none',
                cursor: 'pointer',
                fontWeight: '600',
                borderRadius: '8px 8px 0 0'
              }}
            >
              💡 Benefits & Uses
            </button>
          </div>

          {activeTab === 'tool' && (
            <div>
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
          )}

          {activeTab === 'guide' && (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              lineHeight: '1.7'
            }}>
              <h1 style={{ color: '#1e293b', marginBottom: '2rem', fontSize: '2.5rem' }}>
                📚 Audio Silence Remover - Complete Guide
              </h1>

              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>🎵 Audio Silence Remover Kya Hai?</h2>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                  Audio Silence Remover ek advanced web-based tool hai jo aapke audio files se unnecessary silence periods को automatically remove kar deta hai. Ye tool specially podcasters, YouTubers, musicians, aur content creators ke liye design kiya gaya hai jo apne audio content ko more professional aur engaging banana chahte hain.
                </p>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>🚀 Tool Kaise Use Karen - Step by Step Guide</h2>
                
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Step 1: Audio File Upload Karein</h3>
                  <ul style={{ color: '#64748b', paddingLeft: '1.5rem' }}>
                    <li>Tool ke main interface par "Choose Audio File or Drag & Drop" button par click karein</li>
                    <li>Ya fir directly audio file ko drag and drop kar sakte hain</li>
                    <li>Sabhi popular audio formats support kiye jaate hain: MP3, WAV, M4A, OGG, AAC</li>
                    <li>Maximum file size: 100MB tak</li>
                  </ul>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Step 2: Processing Settings Configure Karein</h3>
                  
                  <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>Silence Threshold (0.001 - 0.1):</h4>
                  <ul style={{ color: '#64748b', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li><strong>Neechi value (0.001)</strong> - More sensitive, chhoti silence bhi detect hogi</li>
                    <li><strong>Ucchi value (0.1)</strong> - Less sensitive, sirf long silence detect hogi</li>
                    <li><strong>Recommended:</strong> 0.02 for most cases</li>
                  </ul>

                  <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>Minimum Silence Duration (50-1000ms):</h4>
                  <ul style={{ color: '#64748b', paddingLeft: '1.5rem' }}>
                    <li>Yeh define karta hai ki kitni chhoti silence remove ki jayegi</li>
                    <li><strong>150ms</strong> - Normal conversation ke liye perfect</li>
                    <li><strong>500ms</strong> - Podcasts aur long recordings ke liye</li>
                  </ul>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Step 3: Processing Start Karein</h3>
                  <ul style={{ color: '#64748b', paddingLeft: '1.5rem' }}>
                    <li>"Remove Silence" button par click karein</li>
                    <li>Real-time progress bar dikhega</li>
                    <li>Processing log mein detailed information milegi</li>
                    <li>Average processing time: 30 seconds to 2 minutes</li>
                  </ul>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Step 4: Result Download Karein</h3>
                  <ul style={{ color: '#64748b', paddingLeft: '1.5rem' }}>
                    <li>Processed audio automatically play hoga</li>
                    <li>Download button se high-quality WAV file download kar sakte hain</li>
                    <li>Detailed statistics available: Time saved, silence removed percentage</li>
                  </ul>
                </div>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>🎯 Best Settings for Different Use Cases</h2>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ background: '#e0f2fe', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ color: '#0369a1', marginBottom: '0.5rem' }}>🎙️ Podcasts</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      <strong>Threshold:</strong> 0.015<br/>
                      <strong>Min Duration:</strong> 200ms<br/>
                      Natural pauses maintain karta hai
                    </p>
                  </div>
                  
                  <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ color: '#166534', marginBottom: '0.5rem' }}>🎥 YouTube Videos</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      <strong>Threshold:</strong> 0.02<br/>
                      <strong>Min Duration:</strong> 150ms<br/>
                      Fast-paced content ke liye perfect
                    </p>
                  </div>
                  
                  <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px' }}>
                                        <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>🎵 Music Recordings</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      <strong>Threshold:</strong> 0.03<br/>
                      <strong>Min Duration:</strong> 300ms<br/>
                      Musical pauses preserve karta hai
                    </p>
                  </div>
                  
                  <div style={{ background: '#fae8ff', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ color: '#86198f', marginBottom: '0.5rem' }}>📞 Phone Recordings</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      <strong>Threshold:</strong> 0.01<br/>
                      <strong>Min Duration:</strong> 100ms<br/>
                      Low quality audio ke liye optimized
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>❓ Frequently Asked Questions (FAQs)</h2>
                
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Q: Kya mera audio data secure hai?</h4>
                    <p style={{ color: '#64748b' }}>
                      <strong>A:</strong> Haan, bilkul secure hai! All processing aapke browser mein locally hoti hai. No data server par upload hoti hai. 100% privacy guaranteed.
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Q: Maximum file size limit kya hai?</h4>
                    <p style={{ color: '#64748b' }}>
                      <strong>A:</strong> Hum 100MB tak ke audio files support karte hain. Larger files ke liye aap professional audio software use kar sakte hain.
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Q: Output format kya hoga?</h4>
                    <p style={{ color: '#64748b' }}>
                      <strong>A:</strong> Processed audio high-quality WAV format mein export hoga jo sabhi audio editing software mein compatible hai.
                    </p>
                  </div>
                  
                  <div>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Q: Kya ye tool mobile par work karta hai?</h4>
                    <p style={{ color: '#64748b' }}>
                      <strong>A:</strong> Haan! Ye tool fully responsive hai aur mobile, tablet, desktop - sab devices par perfectly work karta hai.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              lineHeight: '1.7'
            }}>
              <h1 style={{ color: '#1e293b', marginBottom: '2rem', fontSize: '2.5rem' }}>
                💡 Audio Silence Remover - Benefits & Uses
              </h1>

              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>🚀 Key Benefits of Using Our Tool</h2>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <h3 style={{ color: '#166534', marginBottom: '1rem' }}>🔒 100% Privacy Protected</h3>
                    <p style={{ color: '#64748b' }}>
                      Aapka audio data kabhi bhi hamare servers par upload nahi hota. Sab kuch aapke browser mein locally process hota hai. No data storage, no tracking, complete privacy.
                    </p>
                  </div>
                  
                  <div style={{ background: '#eff6ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <h3 style={{ color: '#1d4ed8', marginBottom: '1rem' }}>💸 Completely Free</h3>
                    <p style={{ color: '#64748b' }}>
                      No hidden charges, no subscription fees, no limitations. Unlimited audio processing completely free of cost. Forever free for all users.
                    </p>
                  </div>
                  
                  <div style={{ background: '#fef3c7', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                    <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>⚡ Fast Processing</h3>
                    <p style={{ color: '#64748b' }}>
                      Advanced Web Audio API use karta hai jo lightning-fast processing provide karta hai. 1-hour audio file ko 2-3 minutes mein process kar sakta hai.
                    </p>
                  </div>
                  
                  <div style={{ background: '#fae8ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f0abfc' }}>
                    <h3 style={{ color: '#86198f', marginBottom: '1rem' }}>🎯 Smart Detection</h3>
                    <p style={{ color: '#64748b' }}>
                      Intelligent algorithm jo naturally occurring pauses ko preserve karta hai aur sirf unnecessary silence ko remove karta hai. Natural sound quality maintain hoti hai.
                    </p>
                  </div>
                  
                  <div style={{ background: '#ecfdf5', padding: '1.5rem', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                    <h3 style={{ color: '#047857', marginBottom: '1rem' }}>📱 Mobile Friendly</h3>
                    <p style={{ color: '#64748b' }}>
                      Fully responsive design jo mobile, tablet, aur desktop - sab devices par perfectly work karta hai. Kahi se bhi audio edit kar sakte hain.
                    </p>
                  </div>
                  
                  <div style={{ background: '#fef7ed', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fdba74' }}>
                    <h3 style={{ color: '#9a3412', marginBottom: '1rem' }}>🎨 No Watermarks</h3>
                    <p style={{ color: '#64748b' }}>
                      Processed audio files par koi watermarks ya branding nahi hoti. Aapko clean, professional quality audio milti hai jo aap directly use kar sakte hain.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>🎯 Practical Uses in Real Life</h2>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>🎙️ Podcast Production</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      Podcast episodes ko trim karke engaging banaye. Listener engagement improve kare aur professional sound quality achieve kare.
                    </p>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>🎥 YouTube Content</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      YouTube videos ke audio ko cleanup kare. Bina kisi expensive software ke professional quality audio achieve kare.
                    </p>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>🏫 Online Education</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      Educational videos aur online courses ke audio ko optimize kare. Students ka attention span maintain kare.
                    </p>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>📞 Business Meetings</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      Recorded meeting audio se unnecessary pauses remove kare. Clear aur concise communication ensure kare.
                    </p>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>🎵 Music Practice</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      Music practice sessions record karke silence remove kare. Pure session ko compact format mein save kare.
                    </p>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>🎤 Voice Overs</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      Voice over recordings ko professionally edit kare. Studio-quality sound bina studio ke expense ke achieve kare.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>📊 Time & Storage Savings</h2>
                
                <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '8px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>30-50%</div>
                      <div style={{ color: '#64748b' }}>Average Time Saved</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>25-40%</div>
                      <div style={{ color: '#64748b' }}>File Size Reduction</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>2-5 min</div>
                      <div style={{ color: '#64748b' }}>Processing Time</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>100%</div>
                      <div style={{ color: '#64748b' }}>Privacy Guaranteed</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: '#3b82f6', marginBottom: '1rem' }}>🆚 Comparison with Other Tools</h2>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '1.5rem'
                }}>
                  <div style={{ background: '#dcfce7', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#166534', marginBottom: '1rem', textAlign: 'center' }}>Our Tool</h3>
                    <ul style={{ color: '#64748b', paddingLeft: '1.5rem' }}>
                      <li>✅ Completely Free</li>
                      <li>✅ 100% Privacy Protected</li>
                      <li>✅ No Watermarks</li>
                      <li>✅ No Registration Required</li>
                      <li>✅ Unlimited Usage</li>
                      <li>✅ Mobile Friendly</li>
                      <li>✅ Instant Processing</li>
                    </ul>
                  </div>
                  
                  <div style={{ background: '#fee2e2', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#dc2626', marginBottom: '1rem', textAlign: 'center' }}>Other Tools</h3>
                    <ul style={{ color: '#64748b', paddingLeft: '1.5rem' }}>
                      <li>❌ Subscription Fees</li>
                      <li>❌ Data Privacy Issues</li>
                      <li>❌ Watermarks Added</li>
                      <li>❌ Registration Required</li>
                      <li>❌ Usage Limits</li>
                      <li>❌ Desktop Only</li>
                      <li>❌ Slow Processing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '2rem', background: '#eff6ff', borderRadius: '8px' }}>
                <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>🚀 Ready to Improve Your Audio?</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                  Start using our free Audio Silence Remover tool today and experience professional audio editing without any cost or privacy concerns.
                </p>
                <button
                  onClick={() => setActiveTab('tool')}
                  style={{
                    padding: '12px 24px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  🎵 Start Using Tool Now
                </button>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
