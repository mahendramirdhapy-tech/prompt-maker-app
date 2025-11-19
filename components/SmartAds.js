// components/SmartAds.js - Advanced version
import { useEffect, useState } from 'react';
import Script from 'next/script';

const SmartAds = ({ 
  type = 'banner', 
  position = 'header',
  showLabel = true 
}) => {
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check device type
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);

    // Load ads with delay
    const timer = setTimeout(() => {
      setAdsLoaded(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // Get appropriate ad size based on device and type
  const getAdConfig = () => {
    if (isMobile) {
      return {
        banner: { height: '90px', width: '320px' },
        native: { height: '120px', width: '300px' },
        interstitial: { height: '250px', width: '300px' }
      }[type];
    } else {
      return {
        banner: { height: '90px', width: '728px' },
        native: { height: '120px', width: '300px' },
        interstitial: { height: '250px', width: '600px' }
      }[type];
    }
  };

  const adConfig = getAdConfig();

  const adStyle = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '15px 0',
    padding: '15px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '2px dashed #cbd5e1',
    minHeight: adConfig.height,
    minWidth: adConfig.width,
    maxWidth: '100%'
  };

  return (
    <>
      {/* Global Ads Scripts - Ek baar hi load honge */}
      <Script
        strategy="afterInteractive"
        src="https://3nbf4.com/act/files/tag.min.js?z=10209677"
        data-cfasync="false"
        async
      />
      
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(s){
              s.dataset.zone='10209689',
              s.src='https://nap5k.com/tag.min.js'
            })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
          `,
        }}
      />
      
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(s){
              s.dataset.zone='10209722',
              s.src='https://groleegni.net/vignette.min.js'
            })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
          `,
        }}
      />

      {/* Ad Container */}
      <div style={adStyle}>
        {showLabel && (
          <div style={{
            fontSize: '0.8rem',
            color: '#64748b',
            marginBottom: '8px',
            fontWeight: '600'
          }}>
            🔥 Advertisement
          </div>
        )}
        
        {adsLoaded ? (
          <div 
            id={`propeller-ads-${type}-${position}`}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Ads automatically load here */}
          </div>
        ) : (
          <div style={{
            color: '#94a3b8',
            fontSize: '0.9rem'
          }}>
            ⏳ Loading ad...
          </div>
        )}
      </div>
    </>
  );
};

export default SmartAds;
