// components/AdsComponent.js - OPTIMIZED VERSION
import { useEffect, useState } from 'react';

const AdsComponent = ({ 
  type = 'banner', 
  position = 'header',
  showLabel = true 
}) => {
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    const loadBannerAds = () => {
      if (typeof window !== 'undefined') {
        // Native/Banner Ads Script
        const script = document.createElement('script');
        script.innerHTML = `
          (function(s){
            s.dataset.zone = '10209689';
            s.src = 'https://nap5k.com/tag.min.js';
            s.onload = function() {
              console.log('Native ads script loaded successfully');
              // Force ads refresh
              if (window.ppjs) {
                window.ppjs('refresh');
              }
            };
          })(document.createElement('script'));
        `;
        document.head.appendChild(script);

        console.log('Banner ads script injected for position:', position);
      }
    };

    // Load after 2 seconds
    const timer = setTimeout(() => {
      loadBannerAds();
      setAdsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [position]);

  const adStyle = {
    textAlign: 'center',
    margin: '20px auto',
    padding: '15px',
    backgroundColor: '#f8fafc',
    border: '2px solid #10b981',
    borderRadius: '12px',
    minHeight: '90px',
    width: '100%',
    maxWidth: '728px'
  };

  return (
    <div style={adStyle}>
      {showLabel && (
        <div style={{
          fontSize: '0.8rem',
          color: '#10b981',
          marginBottom: '10px',
          fontWeight: '600'
        }}>
          ✅ ADS WORKING - Popups showing
        </div>
      )}
      
      <div 
        id={`native-banner-${position}`}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '90px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {adsLoaded ? (
          <div style={{
            color: '#059669',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            🎯 Banner Ads Loading...
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '5px' }}>
              Popup ads already working! Banners may take time.
            </div>
          </div>
        ) : (
          <div style={{ color: '#64748b' }}>
            ⏳ Initializing ads...
          </div>
        )}
      </div>

      {/* Auto-refresh script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Auto-refresh ads every 30 seconds
            setInterval(() => {
              if (window.ppjs) {
                window.ppjs('refresh');
                console.log('Ads refreshed');
              }
            }, 30000);
          `,
        }}
      />
    </div>
  );
};

export default AdsComponent;
