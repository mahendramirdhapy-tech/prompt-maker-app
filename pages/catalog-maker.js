// pages/catalog-maker.js - FIXED WITH PROPER AI INTEGRATION
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function CatalogMaker() {
  const [companyName, setCompanyName] = useState("KING'S FOOD PRODUCTS");
  const [tagline, setTagline] = useState('SINCE 2013');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    phone: '+917666903585',
    instagram: '@kingsfoodsproducts',
    timing: 'OPEN DAILY 8AM TO 10PM'
  });
  const router = useRouter();

  // Initial products based on your images
  const initialProducts = [
    {
      id: 1,
      name: 'Soya Chaap 500g',
      description: 'Premium Soya Chaap made from high-protein soy. Soft, flavorful, and perfect for tandoori or curry dishes.',
      price: '',
      image: '',
      category: 'Soya Chaap'
    },
    {
      id: 2,
      name: 'Soya Chaap 2kg',
      description: 'Tender, juicy Soya Chaap Sticks - ready to grill, marinate, or cook. Hygienically packed for fresh taste.',
      price: '',
      image: '',
      category: 'Soya Chaap'
    },
    {
      id: 3,
      name: 'Punjabi Chaap 2Kg',
      description: 'Authentic Punjabi Chaap with rich spices and tender texture. Perfect for tandoori, tikka, and gravy dishes.',
      price: '',
      image: '',
      category: 'Punjabi Chaap'
    },
    {
      id: 4,
      name: 'Dilli Chaap 2Kg',
      description: 'Authentic Delhi Chaap with classic street-style flavour. Soft, juicy, and perfect for tandoori or gravy dishes.',
      price: '',
      image: '',
      category: 'Dilli Chaap'
    },
    {
      id: 5,
      name: 'Soya Tofu',
      description: 'High-protein, fresh Soya Tofu with a smooth texture and mild taste. Ideal for stir-fries, salads, curries, and healthy daily meals.',
      price: '',
      image: '',
      category: 'Tofu'
    },
    {
      id: 6,
      name: 'Masala Tofu',
      description: 'Ready-to-cook Masala Tofu, seasoned with aromatic spices. Perfect for quick snacks, wraps, and curries.',
      price: '',
      image: '',
      category: 'Tofu'
    }
  ];

  useEffect(() => {
    setProducts(initialProducts);
    
    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    if (typeof window !== 'undefined') {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      
      // Check dark mode
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      updateDarkModeStyles(isDark);
      
      // Check user
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

  // FIXED AI GENERATION FUNCTION
  const generateWithAI = async (type = 'descriptions') => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-catalog', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          products: products,
          companyName: companyName,
          industry: 'food'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.products) {
        setProducts(data.products);
      } else {
        // Fallback to local generation if AI fails
        generateLocalContent();
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      // Fallback to local content generation
      generateLocalContent();
    } finally {
      setLoading(false);
    }
  };

  // Local content generation as fallback
  const generateLocalContent = () => {
    const enhancedProducts = products.map(product => ({
      ...product,
      description: `${product.description} Now with enhanced flavor and premium quality ingredients for the best taste experience.`
    }));
    setProducts(enhancedProducts);
  };

  const addNewProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: 'New Product',
      description: 'Product description will be generated automatically.',
      price: '',
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

  const exportCatalog = () => {
    const catalogData = {
      companyName,
      tagline,
      products,
      contactInfo,
      generatedAt: new Date().toISOString()
    };
    
    // Export as JSON
    const blob = new Blob([JSON.stringify(catalogData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalog-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
      color: 'white',
      borderRadius: '15px',
      marginBottom: '30px',
      position: 'relative',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    companyName: {
      fontSize: isMobile ? '1.5rem' : '2.5rem',
      fontWeight: '900',
      margin: '10px 0',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    tagline: {
      fontSize: isMobile ? '0.9rem' : '1.1rem',
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
      backgroundColor: '#d4af37',
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
      borderBottom: `2px solid #d4af37`,
      paddingBottom: '5px',
    },
    productDescription: {
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontSize: '0.95rem',
      marginBottom: '15px',
      lineHeight: '1.5',
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
      color: '#d4af37',
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
            <button onClick={() => navigateTo('/catalog-maker')} style={{...styles.navButton, backgroundColor: '#d4af37', color: 'white'}}>📋 Catalog Maker</button>
          </div>
          <button onClick={toggleDarkMode} style={styles.navButton}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Catalog Header */}
        <div style={styles.header}>
          <div style={{fontSize: '2rem', marginBottom: '10px'}}>👑</div>
          <h1 style={styles.companyName}>{companyName}</h1>
          <div style={styles.tagline}>{tagline}</div>
        </div>

        {/* Control Panel */}
        <div style={styles.controlPanel}>
          <h2 style={{ marginBottom: '20px', color: darkMode ? '#f8fafc' : '#1e293b', textAlign: 'center' }}>🎨 Customize Your Catalog</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={styles.input}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                style={styles.input}
                placeholder="Company tagline"
              />
            </div>
          </div>

          <div style={{ marginTop: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={() => generateWithAI('descriptions')} 
              disabled={loading} 
              style={{...styles.button, opacity: loading ? 0.7 : 1}}
            >
              {loading ? '⚡ Generating...' : '🤖 AI Generate Content'}
            </button>
            <button onClick={addNewProduct} style={{...styles.button, backgroundColor: '#10b981'}}>
              ➕ Add Product
            </button>
            <button onClick={exportCatalog} style={{...styles.button, backgroundColor: '#8b5cf6'}}>
              💾 Export Catalog
            </button>
          </div>
        </div>

        {/* Products by Category */}
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category} style={styles.categorySection}>
            <h2 style={styles.categoryTitle}>{category}</h2>
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
                            backgroundColor: '#d4af37',
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

                  {/* Product Details */}
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                    style={{...styles.input, fontSize: '1.3rem', fontWeight: '700', border: 'none', padding: '0', marginBottom: '10px'}}
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

        {/* Contact Information */}
        <div style={styles.contactSection}>
          <h3 style={{ color: '#d4af37', marginBottom: '20px', fontSize: '1.5rem' }}>📞 ORDER NOW</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: '700', marginBottom: '5px' }}>Phone</div>
              <div style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>{contactInfo.phone}</div>
            </div>
            <div>
              <div style={{ fontWeight: '700', marginBottom: '5px' }}>Instagram</div>
              <div style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>{contactInfo.instagram}</div>
            </div>
            <div>
              <div style={{ fontWeight: '700', marginBottom: '5px' }}>Timing</div>
              <div style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>{contactInfo.timing}</div>
            </div>
          </div>
          <button style={{...styles.button, fontSize: '1.1rem', padding: '15px 30px'}}>
            📞 CALL TO ORDER
          </button>
        </div>

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
