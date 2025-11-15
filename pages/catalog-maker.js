// pages/catalog-maker.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function CatalogMaker() {
  const [catalogTitle, setCatalogTitle] = useState('EXQUISITE BABY CARE PRODUCT');
  const [newProductText, setNewProductText] = useState('NEW PRODUCT');
  const [categoryText, setCategoryText] = useState('BABY STROLLERS AND CHRIS SAFETY & MONITORING');
  const [giftText, setGiftText] = useState('GIFT IN THE WORLD');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Sample initial products
  const initialProducts = [
    {
      id: 1,
      name: 'Premium Baby Stroller',
      price: '$299.99',
      description: 'Luxury comfort with advanced safety features',
      image: '/api/placeholder/300/300'
    },
    {
      id: 2,
      name: 'Baby Monitor Pro',
      price: '$159.99',
      description: 'HD video monitoring with night vision',
      image: '/api/placeholder/300/300'
    },
    {
      id: 3,
      name: 'Organic Baby Cream',
      price: '$24.99',
      description: '100% natural ingredients for sensitive skin',
      image: '/api/placeholder/300/300'
    },
    {
      id: 4,
      name: 'Educational Toy Set',
      price: '$49.99',
      description: 'Developmental toys for growing minds',
      image: '/api/placeholder/300/300'
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateWithAI = async () => {
    setLoading(true);
    try {
      // AI generation logic here
      const response = await fetch('/api/generate-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: catalogTitle,
          category: categoryText,
          type: 'catalog'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update products with AI generated content
        const newProducts = data.products.map((product, index) => ({
          ...products[index],
          name: product.name,
          description: product.description,
          price: product.price
        }));
        setProducts(newProducts);
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      alert('AI generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addNewProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: 'New Product',
      price: '$0.00',
      description: 'Product description',
      image: '/api/placeholder/300/300'
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, field, value) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const exportCatalog = () => {
    const catalogData = {
      title: catalogTitle,
      newProductText,
      categoryText,
      giftText,
      products,
      generatedAt: new Date().toISOString()
    };
    
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
      padding: isMobile ? '20px 0' : '40px 0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '15px',
      marginBottom: '30px',
      position: 'relative',
    },
    catalogTitle: {
      fontSize: isMobile ? '0.8rem' : '1rem',
      fontWeight: '600',
      letterSpacing: '3px',
      marginBottom: '10px',
      opacity: 0.9,
    },
    mainTitle: {
      fontSize: isMobile ? '1.8rem' : '3.5rem',
      fontWeight: '900',
      margin: '10px 0',
      textTransform: 'uppercase',
    },
    newProductBadge: {
      display: 'inline-block',
      backgroundColor: '#ff6b6b',
      color: 'white',
      padding: '8px 20px',
      borderRadius: '25px',
      fontSize: isMobile ? '0.8rem' : '1rem',
      fontWeight: '700',
      margin: '15px 0',
    },
    categoryText: {
      fontSize: isMobile ? '1rem' : '1.3rem',
      fontWeight: '600',
      margin: '10px 0',
      opacity: 0.9,
    },
    giftText: {
      fontSize: isMobile ? '1.2rem' : '1.8rem',
      fontWeight: '700',
      marginTop: '15px',
      textTransform: 'uppercase',
    },
    controlPanel: {
      backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '30px',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      fontSize: '14px',
      marginBottom: '15px',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      margin: '5px',
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '40px',
    },
    productCard: {
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
    },
    productImage: {
      width: '100%',
      height: '200px',
      backgroundColor: darkMode ? '#334155' : '#f1f5f9',
      borderRadius: '8px',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontSize: '14px',
    },
    productName: {
      fontSize: '1.2rem',
      fontWeight: '700',
      marginBottom: '8px',
      color: darkMode ? '#f8fafc' : '#1e293b',
    },
    productPrice: {
      fontSize: '1.4rem',
      fontWeight: '900',
      color: '#667eea',
      marginBottom: '8px',
    },
    productDescription: {
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontSize: '0.9rem',
      marginBottom: '15px',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
    },
    navButton: {
      padding: '10px 20px',
      backgroundColor: darkMode ? '#374151' : '#e5e7eb',
      color: darkMode ? '#f9fafb' : '#374151',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      margin: '5px',
    },
  };

  return (
    <>
      <Head>
        <title>AI Catalog Maker - Create Beautiful Product Catalogs</title>
        <meta name="description" content="Create stunning product catalogs with AI integration. Generate catalog content automatically with our AI tools." />
      </Head>

      <div style={styles.container}>
        {/* Navigation Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => navigateTo('/')} style={styles.navButton}>🏠 Home</button>
            <button onClick={() => navigateTo('/seo')} style={styles.navButton}>🔍 SEO</button>
            <button onClick={() => navigateTo('/code')} style={styles.navButton}>💻 Code</button>
            <button onClick={() => navigateTo('/catalog-maker')} style={{...styles.navButton, backgroundColor: '#667eea', color: 'white'}}>📋 Catalog</button>
          </div>
          <button onClick={toggleDarkMode} style={styles.navButton}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Catalog Header */}
        <div style={styles.header}>
          <div style={styles.catalogTitle}>CATALOG</div>
          <h1 style={styles.mainTitle}>{catalogTitle}</h1>
          <div style={styles.newProductBadge}>{newProductText}</div>
          <div style={styles.categoryText}>{categoryText}</div>
          <div style={styles.giftText}>{giftText}</div>
        </div>

        {/* Control Panel */}
        <div style={styles.controlPanel}>
          <h2 style={{ marginBottom: '20px', color: darkMode ? '#f8fafc' : '#1e293b' }}>🎨 Customize Your Catalog</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Catalog Title</label>
              <input
                type="text"
                value={catalogTitle}
                onChange={(e) => setCatalogTitle(e.target.value)}
                style={styles.input}
                placeholder="Enter catalog title"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>New Product Badge</label>
              <input
                type="text"
                value={newProductText}
                onChange={(e) => setNewProductText(e.target.value)}
                style={styles.input}
                placeholder="New product text"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Category Text</label>
              <input
                type="text"
                value={categoryText}
                onChange={(e) => setCategoryText(e.target.value)}
                style={styles.input}
                placeholder="Category description"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Gift Text</label>
              <input
                type="text"
                value={giftText}
                onChange={(e) => setGiftText(e.target.value)}
                style={styles.input}
                placeholder="Gift section text"
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={generateWithAI} disabled={loading} style={styles.button}>
              {loading ? '⚡ Generating...' : '🤖 AI Generate Catalog'}
            </button>
            <button onClick={addNewProduct} style={{...styles.button, backgroundColor: '#10b981'}}>
              ➕ Add Product
            </button>
            <button onClick={exportCatalog} style={{...styles.button, backgroundColor: '#8b5cf6'}}>
              💾 Export Catalog
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="imageUpload"
            />
            <label htmlFor="imageUpload" style={{...styles.button, backgroundColor: '#f59e0b', cursor: 'pointer'}}>
              🖼️ Upload Image
            </label>
          </div>
        </div>

        {/* Products Grid */}
        <h2 style={{ marginBottom: '20px', color: darkMode ? '#f8fafc' : '#1e293b', textAlign: 'center' }}>
          📦 Products ({products.length})
        </h2>

        <div style={styles.productGrid}>
          {products.map((product) => (
            <div key={product.id} style={styles.productCard}>
              {/* Product Image */}
              <div style={styles.productImage}>
                {selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt="Product" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                ) : (
                  '🖼️ Product Image'
                )}
              </div>

              {/* Product Details */}
              <input
                type="text"
                value={product.name}
                onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                style={{...styles.input, textAlign: 'center', fontSize: '1.2rem', fontWeight: '700'}}
              />
              <input
                type="text"
                value={product.price}
                onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                style={{...styles.input, textAlign: 'center', fontSize: '1.4rem', fontWeight: '900', color: '#667eea'}}
              />
              <textarea
                value={product.description}
                onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                style={{...styles.input, minHeight: '60px', resize: 'vertical'}}
                placeholder="Product description"
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

        {/* AI Features Section */}
        <div style={styles.controlPanel}>
          <h2 style={{ marginBottom: '15px', color: darkMode ? '#f8fafc' : '#1e293b' }}>🚀 AI-Powered Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: darkMode ? '#334155' : '#f1f5f9', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🤖</div>
              <h3 style={{ marginBottom: '10px' }}>AI Content Generation</h3>
              <p style={{ fontSize: '0.9rem', color: darkMode ? '#cbd5e1' : '#64748b' }}>
                Generate product descriptions and titles automatically
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: darkMode ? '#334155' : '#f1f5f9', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎨</div>
              <h3 style={{ marginBottom: '10px' }}>Template Designs</h3>
              <p style={{ fontSize: '0.9rem', color: darkMode ? '#cbd5e1' : '#64748b' }}>
                Multiple catalog templates to choose from
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: darkMode ? '#334155' : '#f1f5f9', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💾</div>
              <h3 style={{ marginBottom: '10px' }}>Export Options</h3>
              <p style={{ fontSize: '0.9rem', color: darkMode ? '#cbd5e1' : '#64748b' }}>
                Export as JSON, PDF, or share online
              </p>
            </div>
          </div>
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
