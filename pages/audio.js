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
        <title>Audio Silence Remover | FileOptimizeTools</title>
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
      </Head>

      {/* Header - Same as index.js */}
      <header className="header">
        <div className="header-container">
          <Link href="/" className="logo">
            🛠️ FileOptimizeTools
          </Link>
          
          <nav className="nav">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/audio" className="nav-link active">
              Audio Tools
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">🎵 Audio Silence Remover</h1>
            <p className="page-description">
              Remove silence from audio files completely offline. No data leaves your browser - 100% private and secure.
            </p>
          </div>

          {/* Tool Card */}
          <div className="tool-card">
            {/* File Input */}
            <div className="input-group">
              <label className="input-label">📁 Select Audio File</label>
              <div className="file-drop-area">
                <div 
                  className="file-drop-zone"
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
                  className="file-input"
                />
              </div>
              {fileName && (
                <div className="file-selected">
                  ✅ Selected: {fileName}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="settings-grid">
              <div className="setting-group">
                <label className="input-label">🎚️ Silence Threshold (0.001 - 0.1)</label>
                <input 
                  id="threshold"
                  type="number" 
                  defaultValue="0.02"
                  step="0.001"
                  min="0.001"
                  max="0.1"
                  className="setting-input"
                />
                <small className="setting-hint">Lower values = more sensitive to silence detection</small>
              </div>

              <div className="setting-group">
                <label className="input-label">⏱️ Minimum Silence (ms)</label>
                <input 
                  id="minDur"
                  type="number" 
                  defaultValue="150"
                  min="50"
                  max="5000"
                  className="setting-input"
                />
                <small className="setting-hint">Shorter silence periods won't be removed</small>
              </div>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Process Button */}
            <button
              onClick={processAudio}
              disabled={isProcessing || !fileName}
              className={`process-button ${isProcessing ? 'processing' : ''}`}
            >
              {isProcessing ? (
                <>
                  <div className="spinner" />
                  Processing Audio...
                </>
              ) : (
                '⚡ Process Audio'
              )}
            </button>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.originalDuration}</div>
                <div className="stat-label">Original Duration</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.processedDuration}</div>
                <div className="stat-label">Processed Duration</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.silenceRemoved}</div>
                <div className="stat-label">Silence Removed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.fileSize}</div>
                <div className="stat-label">File Size</div>
              </div>
            </div>
          )}

          {/* Audio Players */}
          <div className="tool-card">
            <div className="audio-section">
              <h3 className="section-title">🎧 Original Audio</h3>
              {originalAudio && (
                <audio 
                  ref={originalAudioRef}
                  src={originalAudio} 
                  controls 
                  className="audio-player"
                />
              )}
            </div>
          
            <div className="audio-section">
              <h3 className="section-title">✨ Processed Audio</h3>
              {processedAudio && (
                <>
                  <audio 
                    ref={processedAudioRef}
                    src={processedAudio} 
                    controls 
                    className="audio-player"
                  />
                  <a 
                    href={stats?.downloadUrl}
                    download={`silence_removed_${Date.now()}.wav`}
                    className="download-button"
                  >
                    💾 Download Processed Audio
                  </a>
                </>
              )}
            </div>
          </div>
                
          {/* Logs */}
          <div className="tool-card">
            <h3 className="section-title">📊 Processing Log</h3>
            <div className="log-container">
              {logs.map((log, index) => (
                <div key={index} className="log-entry">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section - Same as index.js */}
          <div className="feedback-section">
            <h2 className="feedback-title">💬 Feedback & Support</h2>
            <p className="feedback-description">
              Have questions or suggestions? We'd love to hear from you! 
              Your feedback helps us improve our tools.
            </p>
            <div className="feedback-buttons">
              <a href="mailto:support@fileoptimizetools.com" className="feedback-button">
                📧 Email Support
              </a>
              <a href="https://github.com/yourusername/fileoptimizetools" className="feedback-button">
                ⭐ Rate on GitHub
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Same as index.js */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3 className="footer-logo">🛠️ FileOptimizeTools</h3>
              <p className="footer-description">
                Free, fast, and secure file optimization tools that work completely in your browser. 
                No uploads, no data sharing, 100% private.
              </p>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Quick Links</h4>
              <div className="footer-links">
                <Link href="/" className="footer-link">
                  Home
                </Link>
                <Link href="/audio" className="footer-link">
                  Audio Tools
                </Link>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Features</h4>
              <div className="footer-features">
                <div>🔒 100% Offline Processing</div>
                <div>⚡ No File Uploads</div>
                <div>🎯 Fast & Efficient</div>
                <div>💾 Privacy First</div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2024 FileOptimizeTools. All rights reserved. Made with ❤️ for the open web.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Same styles as index.js */
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
          cursor: pointer;
        }

        .nav {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
          padding: 8px 16px;
          border-radius: 20px;
        }

        .nav-link:hover {
          opacity: 0.8;
        }

        .nav-link.active {
          background: rgba(255,255,255,0.2);
          font-weight: 600;
        }

        .main {
          min-height: 80vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem 0;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title {
          color: #1e293b;
          margin-bottom: 1rem;
          font-size: 2.5rem;
          font-weight: 700;
        }

        .page-description {
          color: #64748b;
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .tool-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }

        .input-group {
          margin-bottom: 2rem;
        }

        .input-label {
          display: block;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #1e293b;
          font-size: 1.1rem;
        }

        .file-drop-area {
          position: relative;
          overflow: hidden;
        }

        .file-drop-zone {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .file-drop-zone:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .file-input {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-selected {
          margin-top: 1rem;
          color: #059669;
          background: #d1fae5;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #a7f3d0;
          font-size: 1rem;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .setting-group {
          margin-bottom: 1rem;
        }

        .setting-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .setting-input:focus {
          border-color: #2563eb;
          outline: none;
        }

        .setting-hint {
          color: #64748b;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          display: block;
        }

        .progress-container {
          width: 100%;
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
          margin: 2rem 0;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #2563eb, #3b82f6);
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .process-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        }

        .process-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        .process-button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .process-button.processing {
          background: #94a3b8;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #bae6fd;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #0369a1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .audio-section {
          margin-bottom: 2.5rem;
        }

        .audio-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          color: #1e293b;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .audio-player {
          width: 100%;
          border-radius: 12px;
          background: #f8fafc;
        }

        .download-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
        }

        .download-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
        }

        .log-container {
          background: #1e293b;
          color: #10b981;
          padding: 1.5rem;
          border-radius: 12px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          height: 250px;
          overflow-y: auto;
          border: 1px solid #374151;
        }

        .log-entry {
          margin-bottom: 0.75rem;
          line-height: 1.4;
          border-bottom: 1px solid #374151;
          padding-bottom: 0.75rem;
        }

        .log-entry:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        /* Feedback Section Styles - Same as index.js */
        .feedback-section {
          text-align: center;
          padding: 3rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .feedback-title {
          color: #1e293b;
          font-size: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .feedback-description {
          color: #64748b;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }

        .feedback-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .feedback-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .feedback-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
        }

        /* Footer Styles - Same as index.js */
        .footer {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 3rem 0 2rem;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-logo {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #fbbf24;
        }

        .footer-description {
          color: #cbd5e1;
          line-height: 1.6;
          font-size: 1rem;
        }

        .footer-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-link {
          color: #cbd5e1;
          text-decoration: none;
          transition: color 0.2s;
          font-size: 1rem;
          cursor: pointer;
        }

        .footer-link:hover {
          color: white;
        }

        .footer-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          color: #cbd5e1;
          font-size: 1rem;
        }

        .footer-bottom {
          border-top: 1px solid #475569;
          padding-top: 2rem;
          text-align: center;
          color: #94a3b8;
          font-size: 0.9rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .nav {
            gap: 1rem;
          }

          .settings-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .feedback-buttons {
            flex-direction: column;
            align-items: center;
          }

          .page-title {
            font-size: 2rem;
          }

          .tool-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
