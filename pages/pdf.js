import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function PDFMaker() {
  const [user, setUser] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('document.pdf');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(12);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [images, setImages] = useState([]);
  const [alignment, setAlignment] = useState('left');
  
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Auth functions
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTextFormatting = (format) => {
    const formats = {
      bold: `**Bold Text**`,
      italic: `*Italic Text*`,
      underline: `__Underlined Text__`,
      heading: `# Heading`,
      list: `- List item`
    };
    
    setContent(prev => prev + `${prev ? '\n' : ''}${formats[format]}`);
  };

  const generatePDF = async () => {
    if (!content.trim() && images.length === 0) {
      alert('Please enter some content or add images');
      return;
    }

    setIsGenerating(true);

    try {
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const lineHeight = fontSize * 0.3528; // Convert px to mm

      // Set text color and style
      doc.setTextColor(textColor);
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal', isItalic ? 'italic' : 'normal');

      // Process content with basic markdown
      const lines = content.split('\n');
      
      for (let line of lines) {
        // Check if we need a new page
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }

        // Basic markdown parsing
        let currentLine = line;
        let currentStyle = { bold: false, italic: false };

        // Handle bold
        if (currentLine.includes('**')) {
          currentStyle.bold = true;
          currentLine = currentLine.replace(/\*\*/g, '');
        }

        // Handle italic
        if (currentLine.includes('*')) {
          currentStyle.italic = true;
          currentLine = currentLine.replace(/\*/g, '');
        }

        // Handle underline
        if (currentLine.includes('__')) {
          doc.setDrawColor(0);
          doc.line(margin, yPosition + 2, margin + doc.getTextWidth(currentLine), yPosition + 2);
          currentLine = currentLine.replace(/__/g, '');
        }

        // Handle headings
        if (currentLine.startsWith('# ')) {
          doc.setFontSize(16);
          currentLine = currentLine.substring(2);
        }

        // Apply styles
        doc.setFont('helvetica', currentStyle.bold ? 'bold' : 'normal', currentStyle.italic ? 'italic' : 'normal');

        // Set alignment
        const textWidth = doc.getTextWidth(currentLine);
        let xPosition = margin;
        
        if (alignment === 'center') {
          xPosition = (doc.internal.pageSize.width - textWidth) / 2;
        } else if (alignment === 'right') {
          xPosition = doc.internal.pageSize.width - margin - textWidth;
        }

        doc.text(currentLine, xPosition, yPosition);
        
        // Reset font size for normal text
        if (line.startsWith('# ')) {
          doc.setFontSize(fontSize);
        }

        yPosition += lineHeight + 2;
      }

      // Add images
      for (let img of images) {
        if (yPosition > pageHeight - 100) {
          doc.addPage();
          yPosition = margin;
        }

        try {
          const imgData = await loadImageData(img.url);
          const imgProps = doc.getImageProperties(imgData);
          const width = Math.min(150, imgProps.width);
          const height = (width * imgProps.height) / imgProps.width;
          
          doc.addImage(imgData, 'JPEG', margin, yPosition, width, height);
          yPosition += height + 10;
        } catch (error) {
          console.error('Error adding image:', error);
        }
      }

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

  const loadImageData = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  return (
    <>
      <Head>
        <title>Advanced PDF Maker | Create Professional PDFs with Images & Text Formatting</title>
        <meta 
          name="description" 
          content="Free online PDF maker with advanced features. Create professional PDFs with images, text formatting, colors, bold, italic and more. 100% secure browser-based PDF generation." 
        />
        <meta name="keywords" content="PDF maker, PDF creator, PDF generator, online PDF, PDF with images, text formatting PDF, free PDF tool" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Advanced PDF Maker - Create Professional PDFs Online" />
        <meta property="og:description" content="Create beautiful PDFs with images, formatted text, and professional layouts. Free online PDF maker tool." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://yoursite.com/pdf" />
      </Head>

      <Layout user={user} handleLogin={handleLogin} handleLogout={handleLogout}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Header with SEO-rich content */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ 
              color: '#1e293b', 
              marginBottom: '1rem', 
              fontSize: '2.8rem',
              fontWeight: '700',
              lineHeight: '1.2'
            }}>
              🎨 Advanced PDF Maker
            </h1>
            <p style={{ 
              color: '#64748b', 
              fontSize: '1.3rem',
              maxWidth: '800px',
              margin: '0 auto 1.5rem',
              lineHeight: '1.6'
            }}>
              Create professional PDF documents with images, formatted text, colors, and advanced styling. 
              <strong> 100% free</strong> and <strong>completely secure</strong> - no data leaves your browser.
            </p>
          </div>

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Left Column - Editor */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', fontSize: '1.5rem' }}>
                ✍️ PDF Content Editor
              </h2>
              
              {/* File Name */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  📄 File Name
                </label>
                <input 
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter PDF file name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Text Formatting Toolbar */}
              <div style={{ 
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>🎨 Text Formatting</h4>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {/* Color Picker */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#6b7280' }}>Text Color</label>
                    <input 
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      style={{
                        width: '100%',
                        height: '40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  {/* Font Size */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#6b7280' }}>Font Size</label>
                    <select 
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value={10}>Small (10pt)</option>
                      <option value={12}>Normal (12pt)</option>
                      <option value={14}>Medium (14pt)</option>
                      <option value={16}>Large (16pt)</option>
                      <option value={18}>X-Large (18pt)</option>
                    </select>
                  </div>

                  {/* Alignment */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#6b7280' }}>Alignment</label>
                    <select 
                      value={alignment}
                      onChange={(e) => setAlignment(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>

                {/* Formatting Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setIsBold(!isBold)}
                    style={{
                      padding: '8px 12px',
                      background: isBold ? '#3b82f6' : '#f3f4f6',
                      color: isBold ? 'white' : '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: isBold ? 'bold' : 'normal'
                    }}
                  >
                    𝐁 Bold
                  </button>
                  
                  <button 
                    onClick={() => setIsItalic(!isItalic)}
                    style={{
                      padding: '8px 12px',
                      background: isItalic ? '#3b82f6' : '#f3f4f6',
                      color: isItalic ? 'white' : '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontStyle: isItalic ? 'italic' : 'normal'
                    }}
                  >
                    𝐼 Italic
                  </button>

                  {['heading', 'bold', 'italic', 'underline', 'list'].map(format => (
                    <button 
                      key={format}
                      onClick={() => addTextFormatting(format)}
                      style={{
                        padding: '8px 12px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {format === 'heading' && 'H Heading'}
                      {format === 'bold' && '𝐁 Bold'}
                      {format === 'italic' && '𝐼 Italic'}
                      {format === 'underline' && 'U Underline'}
                      {format === 'list' && '• List'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload Section */}
              <div style={{ 
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>🖼️ Add Images</h4>
                
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  style={{
                    padding: '2rem',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f1f5f9',
                    marginBottom: '1rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#e0f2fe'}
                  onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}📷</div>
                  <div style={{ color: '#64748b' }}>Click to Add Images</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>JPG, PNG, GIF supported</div>
                </div>

                <input 
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />

                {/* Image Preview */}
                {images.length > 0 && (
                  <div>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
                      Selected Images ({images.length})
                    </h5>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
                      gap: '0.5rem' 
                    }}>
                      {images.map((img, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img 
                            src={img.url} 
                            alt={img.name}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0'
                            }}
                          />
                          <button 
                            onClick={() => removeImage(index)}
                            style={{
                              position: 'absolute',
                              top: '-5px',
                              right: '-5px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Content Textarea */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  📝 Content (Supports **bold**, *italic*, __underline__, # headings)
                </label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your content here... Use **bold** for bold text, *italic* for italic, __underline__ for underline, and # for headings"
                  rows="15"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                  }}
                />
              </div>

              {/* Generate Button */}
              <button 
                onClick={generatePDF}
                disabled={isGenerating || (!content.trim() && images.length === 0)}
                style={{
                  width: '100%',
                  padding: '15px 24px',
                  background: isGenerating || (!content.trim() && images.length === 0) ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isGenerating || (!content.trim() && images.length === 0) ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {isGenerating ? '🔄 Generating PDF...' : '📄 Generate PDF Now'}
              </button>
            </div>

            {/* Right Column - Preview & Download */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              position: 'sticky',
              top: '2rem',
              height: 'fit-content'
            }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', fontSize: '1.5rem' }}>
                👀 PDF Preview & Download
              </h2>
              
              {pdfUrl ? (
                <div>
                  <div style={{ 
                    border: '2px solid #10b981', 
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    background: '#f0fdf4'
                  }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
                    <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.2rem' }}>{fileName}</div>
                    <div style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
                      Professional PDF Document
                    </div>
                    <div style={{ 
                      background: '#dcfce7', 
                      color: '#166534',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      marginTop: '1rem',
                      display: 'inline-block'
                    }}>
                      ✅ Ready to Download
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                    <a 
                      href={pdfUrl}
                      download={fileName}
                      style={{
                        padding: '15px 24px',
                        background: '#3b82f6',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                      onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                    >
                      💾 Download PDF
                    </a>
                    
                    <button 
                      onClick={() => window.open(pdfUrl, '_blank')}
                      style={{
                        padding: '15px 24px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#4b5563'}
                      onMouseLeave={(e) => e.target.style.background = '#6b7280'}
                    >
                      👁️ Preview in New Tab
                    </button>

                    <button 
                      onClick={() => {
                        setPdfUrl(null);
                        setContent('');
                        setImages([]);
                      }}
                      style={{
                        padding: '12px 24px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem'
                      }}
                    >
                      🆕 Create New PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  border: '2px dashed #d1d5db', 
                  borderRadius: '8px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  color: '#64748b',
                  background: '#f8fafc'
                }}>
                  <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📄</div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>No PDF Generated Yet</h3>
                  <p style={{ margin: 0, lineHeight: '1.5' }}>
                    Your professionally formatted PDF with images and styled text will appear here after generation.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SEO Rich Features Section */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '3rem 2rem',
            borderRadius: '12px',
            color: 'white',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              margin: '0 0 2rem 0', 
              fontSize: '2rem',
              fontWeight: '700'
            }}>
              🚀 Why Choose Our PDF Maker?
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {[
                {
                  icon: '🔒',
                  title: '100% Secure & Private',
                  desc: 'All processing happens in your browser. No data is stored on our servers.'
                },
                {
                  icon: '🎨',
                  title: 'Advanced Formatting',
                  desc: 'Rich text formatting, colors, fonts, images, and professional layouts.'
                },
                {
                  icon: '⚡',
                  title: 'Fast Processing',
                  desc: 'Generate professional PDFs in seconds with our optimized engine.'
                },
                {
                  icon: '💯',
                  title: 'Completely Free',
                  desc: 'No hidden costs, no watermarks, no registration required.'
                },
                {
                  icon: '📱',
                  title: 'Mobile Friendly',
                  desc: 'Works perfectly on all devices - desktop, tablet, and mobile.'
                },
                {
                  icon: '🖼️',
                  title: 'Image Support',
                  desc: 'Add multiple images with automatic scaling and positioning.'
                }
              ].map((feature, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                  <h3 style={{ 
                    color: 'white', 
                    marginBottom: '0.5rem',
                    fontSize: '1.3rem',
                    fontWeight: '600'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ 
                    color: '#e2e8f0', 
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content Section */}
          <div style={{
            background: '#f8fafc',
            padding: '3rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              margin: '0 0 2rem 0', 
              color: '#1e293b',
              fontSize: '2rem'
            }}>
              Create Professional PDFs Online - Free PDF Maker Tool
            </h2>
            
            <div style={{
              columns: '2',
              gap: '2rem',
              color: '#64748b',
              lineHeight: '1.7'
            }}>
              <p>
                <strong>Our advanced PDF Maker tool</strong> allows you to create professional PDF documents 
                with ease. Whether you need to generate reports, create presentations, or make professional 
                documents, our tool has everything you need.
              </p>
              
              <p>
                <strong>Key features include:</strong> Rich text formatting with bold, italic, and underline 
                options; Multiple font sizes and colors; Image insertion and management; Text alignment 
                controls; Professional PDF layouts; Instant download and preview.
              </p>
              
              <p>
                <strong>Perfect for:</strong> Business professionals, students, teachers, content creators, 
                and anyone who needs to create professional-looking PDF documents quickly and easily.
              </p>
              
              <p>
                <strong>No installation required</strong> - our PDF maker works entirely in your web browser. 
                Your documents are processed locally and never leave your computer, ensuring complete 
                privacy and security.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
