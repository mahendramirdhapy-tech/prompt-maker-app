// pages/catalog-maker.js - COMPATIBLE WITH YOUR PACKAGE.JSON
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Dynamic imports for optional dependencies
let html2canvas, jsPDF;

if (typeof window !== 'undefined') {
  import('html2canvas').then(module => {
    html2canvas = module.default;
  });
  import('jspdf').then(module => {
    jsPDF = module.default;
  });
}

export default function CatalogMaker() {
  const [catalogData, setCatalogData] = useState({
    companyName: 'Your Company Name',
    tagline: 'Since 2024',
    contact: {
      phone: '+91 XXXXX XXXXX',
      email: 'contact@company.com',
      address: 'Your Business Address',
      timing: 'OPEN DAILY 9AM TO 9PM'
    }
  });
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('edit');
  const catalogRef = useRef(null);
  const router = useRouter();

  // Sample template products
  const templateProducts = [
    {
      id: 1,
      name: 'Premium Product 500g',
      description: 'High-quality product with excellent features and premium ingredients. Perfect for daily use and special occasions.',
      price: '₹499',
      image: '',
      category: 'Premium Range'
    },
    {
      id: 2,
      name: 'Deluxe Product 1kg',
      description: 'Premium deluxe version with enhanced features and superior quality. Ideal for professional use.',
      price: '₹899',
      image: '',
      category: 'Deluxe Range'
    },
    {
      id: 3,
      name: 'Standard Product 250g',
      description: 'Quality product at an affordable price. Great for everyday use and family consumption.',
      price: '₹249',
      image: '',
      category: 'Standard Range'
    },
    {
      id: 4,
      name: 'Special Edition Pack',
      description: 'Limited edition product with exclusive features and premium packaging. Perfect for gifting.',
      price: '₹1299',
      image: '',
      category: 'Special Edition'
    }
  ];

  useEffect(() => {
    setProducts(templateProducts);
    
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    if (typeof window !== 'undefined') {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      updateDarkModeStyles(isDark);
      
      const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      };
      checkUser();
    }

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const updateDarkModeStyles = (isDark) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (isDark) {
        root.style.setProperty('--bg-primary', '#0f172a');
        root.style.setProperty('--bg-secondary', '#1e293b');
        root.style.setProperty('--text-primary', '#f8fafc');
        root.style.setProperty('--text-secondary', '#cbd5e1');
        root.style.setProperty('--border-color', '#334155');
      } else {
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8fafc');
        root.style.setProperty('--text-primary', '#1e293b');
        root.style.setProperty('--text-secondary', '#64748b');
        root.style.setProperty('--border-color', '#e2e8f0');
      }
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newDarkMode.toString());
    }
    updateDarkModeStyles(newDarkMode);
  };

  const handleImageUpload = (e, productId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProducts(products.map(product => 
          product.id === productId 
            ? { ...product, image: e.target.result }
            : product
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateCatalogData = (field, value) => {
    setCatalogData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateContact = (field, value) => {
    setCatalogData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  // AI GENERATION FUNCTION
  const generateWithAI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-catalog', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: products,
          companyName: catalogData.companyName,
          industry: 'general'
        }),
      });

      const data = await response.json();
      
      if (data.success && data.products) {
        setProducts(data.products);
      } else {
        generateLocalContent();
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      generateLocalContent();
    } finally {
      setLoading(false);
    }
  };

  const generateLocalContent = () => {
    const enhancedProducts = products.map(product => ({
      ...product,
      description: `${product.description} Now with enhanced quality and customer satisfaction guarantee.`
    }));
    setProducts(enhancedProducts);
  };

  const addNewProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: 'New Product',
      description: 'Product description will be generated automatically.',
      price: '₹0',
      image: '',
      category: 'New Category'
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, field, value) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    } else {
      alert('You need at least one product in the catalog.');
    }
  };

  // EXPORT AS JSON
  const exportAsJSON = () => {
    const exportData = {
      companyName: catalogData.companyName,
      tagline: catalogData.tagline,
      products,
      contact: catalogData.contact,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalog-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // DOWNLOAD AS IMAGE
  const downloadAsImage = async () => {
    if (!catalogRef.current || !html2canvas) {
      alert('Image download feature is loading. Please try again in a moment.');
      return;
    }
    
    setLoading(true);
    try {
      const canvas = await html2canvas(catalogRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: darkMode ? '#0f172a' : '#ffffff'
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `catalog-${Date.now()}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // DOWNLOAD AS PDF
  const downloadAsPDF = async () => {
    if (!catalogRef.current || !html2canvas || !jsPDF) {
      alert('PDF download feature is loading. Please try again in a moment.');
      return;
    }
    
    setLoading(true);
    try {
      const canvas = await html2canvas(catalogRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: darkMode ? '#0f172a' : '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`catalog-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '12px' : '24px',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
    },
    header: {
      textAlign: 'center',
      padding: isMobile ? '30px 20px' : '50px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '15px',
      marginBottom: '30px',
      position: 'relative',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    companyName: {
      fontSize: isMobile ? '1.8rem' : '3rem',
      fontWeight: '900',
      margin: '10px 0',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    tagline: {
      fontSize: isMobile ? '1rem' : '1.2rem',
      fontWeight: '600',
      opacity: 0.9,
      letterSpacing: '1px',
    },
    controlPanel: {
      backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
      padding: '25px',
      borderRadius: '12px',
      marginBottom: '30px',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      borderRadius: '8px',
      border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      fontSize: '14px',
      marginBottom: '15px',
      fontFamily: 'inherit',
    },
    button: {
      padding: '12px 20px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      margin: '5px',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
    },
    tabContainer: {
      display: 'flex',
      marginBottom: '20px',
      borderBottom: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    },
    tab: {
      padding: '12px 24px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      borderBottom: '3px solid transparent',
    },
    catalogPreview: {
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '12px',
      padding: '30px',
      marginBottom: '30px',
      minHeight: '500px',
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '25px',
      marginBottom: '40px',
    },
    productCard: {
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '12px',
      padding: '20px',
      position: 'relative',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
    },
    productImage: {
      width: '100%',
      height: '180px',
      backgroundColor: darkMode ? '#334155' : '#f1f5f9',
      borderRadius: '8px',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontSize: '14px',
      border: `1px dashed ${darkMode ? '#475569' : '#cbd5e1'}`,
    },
    productName: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '10px',
      color: darkMode ? '#f8fafc' : '#1e293b',
      borderBottom: `2px solid #667eea`,
      paddingBottom: '5px',
    },
    productDescription: {
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontSize: '0.95rem',
      marginBottom: '15px',
      lineHeight: '1.5',
    },
    productPrice: {
      fontSize: '1.4rem',
      fontWeight: '900',
      color: '#667eea',
      marginBottom: '10px',
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
    },
    navButton: {
      padding: '10px 16px',
      backgroundColor: darkMode ? '#374151' : '#e5e7eb',
      color: darkMode ? '#f9fafb' : '#374151',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      margin: '5px',
      fontFamily: 'inherit',
    },
    categorySection: {
      marginBottom: '40px',
    },
    categoryTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#667eea',
      marginBottom: '20px',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    contactSection: {
      backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
      padding: '30px',
      borderRadius: '12px',
      textAlign: 'center',
      marginTop: '40px',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    },
  };

  // Catalog Preview Component
  const CatalogPreview = () => (
    <div ref={catalogRef} style={styles.catalogPreview}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px',
        marginBottom: '40px'
      }}>
        <div style={{fontSize: '3rem', marginBottom: '15px'}}>🏢</div>
        <h1 style={{fontSize: '2.5rem', fontWeight: '900', margin: '10px 0', textTransform: 'uppercase'}}>
          {catalogData.companyName}
        </h1>
        <div style={{fontSize: '1.2rem', fontWeight: '600', opacity: 0.9}}>
          {catalogData.tagline}
        </div>
      </div>

      {/* Products by Category */}
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category} style={styles.categorySection}>
          <h2 style={styles.categoryTitle}>{category}</h2>
          <div style={styles.productGrid}>
            {categoryProducts.map((product) => (
              <div key={product.id} style={styles.productCard}>
                <div style={styles.productImage}>
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📦</div>
                      <span>Product Image</span>
                    </div>
                  )}
                </div>

                <h3 style={styles.productName}>{product.name}</h3>
                <div style={styles.productPrice}>{product.price}</div>
                <p style={styles.productDescription}>{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Contact Information */}
      <div style={styles.contactSection}>
        <h3 style={{ color: '#667eea', marginBottom: '20px', fontSize: '1.5rem' }}>📞 CONTACT US</h3>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '5px' }}>Phone</div>
            <div style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>{catalogData.contact.phone}</div>
          </div>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '5px' }}>Email</div>
            <div style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>{catalogData.contact.email}</div>
          </div>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '5px' }}>Address</div>
            <div style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>{catalogData.contact.address}</div>
          </div>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '5px' }}>Business Hours</div>
            <div style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>{catalogData.contact.timing}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>AI Catalog Maker - Create Professional Product Catalogs</title>
        <meta name="description" content="Create stunning product catalogs with AI integration. Generate catalog content automatically with our AI tools." />
      </Head>

      <div style={styles.container}>
        {/* Navigation Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => navigateTo('/')} style={styles.navButton}>🏠 Home</button>
            <button onClick={() => navigateTo('/seo')} style={styles.navButton}>🔍 SEO</button>
            <button onClick={() => navigateTo('/code')} style={styles.navButton}>💻 Code</button>
            <button onClick={() => navigateTo('/catalog-maker')} style={{...styles.navButton, backgroundColor: '#667eea', color: 'white'}}>📋 Catalog Maker</button>
          </div>
          <button onClick={toggleDarkMode} style={styles.navButton}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabContainer}>
          <button 
            onClick={() => setActiveTab('edit')} 
            style={{
              ...styles.tab,
              borderBottomColor: activeTab === 'edit' ? '#667eea' : 'transparent',
              color: activeTab === 'edit' ? '#667eea' : (darkMode ? '#cbd5e1' : '#64748b')
            }}
          >
            ✏️ Edit Catalog
          </button>
          <button 
            onClick={() => setActiveTab('preview')} 
            style={{
              ...styles.tab,
              borderBottomColor: activeTab === 'preview' ? '#667eea' : 'transparent',
              color: activeTab === 'preview' ? '#667eea' : (darkMode ? '#cbd5e1' : '#64748b')
            }}
          >
            👁️ Preview
          </button>
        </div>

        {activeTab === 'edit' ? (
          <>
            {/* Control Panel */}
            <div style={styles.controlPanel}>
              <h2 style={{ marginBottom: '20px', color: darkMode ? '#f8fafc' : '#1e293b', textAlign: 'center' }}>🎨 Customize Your Catalog</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Company Name</label>
                  <input
                    type="text"
                    value={catalogData.companyName}
                    onChange={(e) => updateCatalogData('companyName', e.target.value)}
                    style={styles.input}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Tagline</label>
                  <input
                    type="text"
                    value={catalogData.tagline}
                    onChange={(e) => updateCatalogData('tagline', e.target.value)}
                    style={styles.input}
                    placeholder="Company tagline"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Phone</label>
                  <input
                    type="text"
                    value={catalogData.contact.phone}
                    onChange={(e) => updateContact('phone', e.target.value)}
                    style={styles.input}
                    placeholder="Contact phone"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
                  <input
                    type="text"
                    value={catalogData.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    style={styles.input}
                    placeholder="Contact email"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Address</label>
                  <input
                    type="text"
                    value={catalogData.contact.address}
                    onChange={(e) => updateContact('address', e.target.value)}
                    style={styles.input}
                    placeholder="Business address"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Business Hours</label>
                  <input
                    type="text"
                    value={catalogData.contact.timing}
                    onChange={(e) => updateContact('timing', e.target.value)}
                    style={styles.input}
                    placeholder="Business timing"
                  />
                </div>
              </div>

              <div style={{ marginTop: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button 
                  onClick={generateWithAI} 
                  disabled={loading} 
                  style={{...styles.button, opacity: loading ? 0.7 : 1}}
                >
                  {loading ? '⚡ Generating...' : '🤖 AI Generate Content'}
                </button>
                <button onClick={addNewProduct} style={{...styles.button, backgroundColor: '#10b981'}}>
                  ➕ Add Product
                </button>
                <button onClick={exportAsJSON} style={{...styles.button, backgroundColor: '#8b5cf6'}}>
                  💾 Export JSON
                </button>
                <button onClick={downloadAsImage} style={{...styles.button, backgroundColor: '#f59e0b'}}>
                  🖼️ Download Image
                </button>
                <button onClick={downloadAsPDF} style={{...styles.button, backgroundColor: '#ef4444'}}>
                  📄 Download PDF
                </button>
              </div>
            </div>

            {/* Products Editor */}
            <h2 style={{ marginBottom: '20px', color: darkMode ? '#f8fafc' : '#1e293b', textAlign: 'center' }}>
              📦 Manage Products ({products.length})
            </h2>

            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <div key={category} style={styles.categorySection}>
                <h3 style={{...styles.categoryTitle, fontSize: '1.5rem'}}>{category}</h3>
                <div style={styles.productGrid}>
                  {categoryProducts.map((product) => (
                    <div key={product.id} style={styles.productCard}>
                      {/* Product Image Upload */}
                      <div style={styles.productImage}>
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ) : (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🖼️</div>
                            <span>Product Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, product.id)}
                              style={{ display: 'none' }}
                              id={`imageUpload-${product.id}`}
                            />
                            <label 
                              htmlFor={`imageUpload-${product.id}`}
                              style={{
                                display: 'inline-block',
                                marginTop: '8px',
                                padding: '6px 12px',
                                backgroundColor: '#667eea',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Upload Image
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Product Details Editor */}
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        style={{...styles.input, fontSize: '1.3rem', fontWeight: '700', border: 'none', padding: '0', marginBottom: '10px'}}
                      />
                      
                      <input
                        type="text"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                        style={{...styles.input, fontSize: '1.4rem', fontWeight: '900', color: '#667eea', border: 'none', padding: '0', marginBottom: '10px'}}
                        placeholder="Product price"
                      />
                      
                      <textarea
                        value={product.description}
                        onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                        style={{...styles.input, minHeight: '80px', resize: 'vertical', fontSize: '0.95rem'}}
                        placeholder="Product description"
                      />

                      <input
                        type="text"
                        value={product.category}
                        onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                        style={{...styles.input, fontSize: '0.9rem', fontStyle: 'italic'}}
                        placeholder="Product category"
                      />

                      {/* Action Buttons */}
                      <div style={styles.actionButtons}>
                        <button 
                          onClick={() => removeProduct(product.id)}
                          style={{...styles.button, backgroundColor: '#ef4444', padding: '8px 16px', fontSize: '12px'}}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <CatalogPreview />
        )}

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '40px 20px',
          marginTop: '50px',
          borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          color: darkMode ? '#cbd5e1' : '#64748b'
        }}>
          <p>© 2024 AI Catalog Maker. Create beautiful product catalogs with AI.</p>
        </footer>
      </div>
    </>
  );
                         }
