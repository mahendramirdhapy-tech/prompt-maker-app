import { useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function PDFMaker() {
  const [user, setUser] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('document.pdf');

  // Auth functions (same as audio.js)
  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
    } catch (error) {
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

  const generatePDF = async () => {
    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    setIsGenerating(true);

    try {
      // Using jsPDF for PDF generation
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      
      // Add content to PDF
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 10, 10);
      
      // Generate PDF blob
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      
      setPdfUrl(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setFileName(file.name);
  };

  return (
    <>
      <Head>
        <title>PDF Maker | Create PDF Online</title>
        <meta name="description" content="Create PDF files online for free. Generate PDF from text with our easy-to-use PDF maker tool." />
      </Head>

      <Layout user={user} handleLogin={handleLogin} handleLogout={handleLogout}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ 
              color: '#1e293b', 
              marginBottom: '1rem', 
              fontSize: '2.5rem',
              fontWeight: '700'
            }}>
              📄 PDF Maker
            </h1>
            <p style={{ 
              color: '#64748b', 
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Create professional PDF documents online for free. No registration required.
            </p>
          </div>

          {/* Main Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Input Section */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>✍️ Create PDF</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  File Name
                </label>
                <input 
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Content
                </label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your text content here..."
                  rows="12"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button 
                onClick={generatePDF}
                disabled={isGenerating || !content.trim()}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: isGenerating || !content.trim() ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isGenerating || !content.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {isGenerating ? '🔄 Generating PDF...' : '📄 Generate PDF'}
              </button>
            </div>

            {/* Preview Section */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>👀 Preview & Download</h3>
              
              {pdfUrl ? (
                <div>
                  <div style={{ 
                    border: '2px dashed #d1d5db', 
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{fileName}</div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>PDF Document</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a 
                      href={pdfUrl}
                      download={fileName}
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        background: '#3b82f6',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontWeight: '600',
                        minWidth: '120px'
                      }}
                    >
                      💾 Download
                    </a>
                    
                    <button 
                      onClick={() => window.open(pdfUrl, '_blank')}
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        minWidth: '120px'
                      }}
                    >
                      👁️ Preview
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  border: '2px dashed #d1d5db', 
                  borderRadius: '8px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  color: '#64748b'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>No PDF Generated</h4>
                  <p>Your generated PDF will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div style={{
            background: '#f8fafc',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 2rem 0', color: '#1e293b' }}>
              🚀 Why Use Our PDF Maker?
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>100% Secure</h4>
                <p style={{ color: '#64748b', lineHeight: '1.5' }}>
                  All processing happens in your browser. No data is stored on our servers.
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Fast & Easy</h4>
                <p style={{ color: '#64748b', lineHeight: '1.5' }}>
                  Create PDFs in seconds with our simple and intuitive interface.
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💯</div>
                <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Free Forever</h4>
                <p style={{ color: '#64748b', lineHeight: '1.5' }}>
                  No hidden costs, no watermarks, completely free to use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
