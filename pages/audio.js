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
      </Head>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* Simple Header */}
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
            🛠️ FileOptimizeTools
          </Link>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link href="/audio" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Audio Tools</Link>
          </nav>
        </header>

        {/* Main Content */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: '2.5rem' }}>
            🎵 Audio Silence Remover
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
            Remove silence from audio files completely offline. No data leaves your browser.
          </p>
        </div>

        {/* Rest of your audio tool code here */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}>
          {/* File Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
              📁 Select Audio File
            </label>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
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

          {/* Settings and other components... */}
          {/* ... (rest of your audio.js code) ... */}
        </div>
      </div>
    </>
  );
}
