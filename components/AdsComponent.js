// components/AdsComponent.js
import { useEffect, useState } from 'react';
import Script from 'next/script';

const AdsComponent = ({ 
  type = 'banner', 
  position = 'header',
  showLabel = true,
  className = ''
}) => {
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAd, setShowAd] = useState(true);

  useEffect(() => {
    // Check device type
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check if user has ad blocker
    const checkAdBlocker = async () => {
      try {
        await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
          method: 'HEAD',
          mode: 'no-cors'
        });
        setShowAd(true);
      } catch (error) {
        console.log('Ad blocker detected');
        setShowAd(false);
      }
    };

    checkDevice();
    checkAdBlocker();
    window.addEventListener('resize', checkDevice);

    // Load ads with smart delay based on position
    let delay = 1000;
    if (position.includes('top')) delay = 500;
    if (position.includes('bottom')) delay = 2000;
    if (type === 'interstitial') delay = 3000;

    const timer = setTimeout(() => {
      setAdsLoaded(true);
    }, delay);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkDevice);
    };
  }, [type, position]);

  // Get appropriate ad size based on device and type
  const getAdConfig = () => {
    const configs = {
      mobile: {
        banner: { height: '100px', width: '320px', name: 'Mobile Banner' },
        native: { height: '120px', width: '300px', name: 'Mobile Native' },
        interstitial: { height: '280px', width: '320px', name: 'Mobile Interstitial' },
        push: { height: '80px', width: '300px', name: 'Push Notification' }
      },
      desktop: {
        banner: { height: '90px', width: '728px', name: 'Leaderboard' },
        native: { height: '250px', width: '300px', name: 'Sidebar' },
        interstitial: { height: '600px', width: '300px', name: 'Interstitial' },
        push: { height: '80px', width: '400px', name: 'Push Notification' }
      }
    };

    return configs[isMobile ? 'mobile' : 'desktop'][type] || configs.desktop.banner;
  };

  const adConfig = getAdConfig();

  // Different styles for different ad types
  const getAdStyle = () => {
    const baseStyle = {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '15px auto',
      padding: '15px',
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      border: '2px dashed #cbd5e1',
      minHeight: adConfig.height,
      minWidth: isMobile ? '100%' : adConfig.width,
      maxWidth: '100%',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    };

    // Type-specific styles
    switch (type) {
      case 'banner':
        return {
          ...baseStyle,
          backgroundColor: '#f1f5f9',
          border: '2px solid #e2e8f0'
        };
      case 'native':
        return {
          ...baseStyle,
          backgroundColor: '#ffffff',
          border: '2px dotted #cbd5e1'
        };
      case 'interstitial':
        return {
          ...baseStyle,
          backgroundColor: '#f8fafc',
          border: '2px solid #94a3b8',
          minHeight: isMobile ? '280px' : '400px'
        };
      case 'push':
        return {
          ...baseStyle,
          backgroundColor: '#ecfdf5',
          border: '2px solid #10b981',
          minHeight: '80px'
        };
      default:
        return baseStyle;
    }
  };

  // Position-specific margins
  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { margin: '10px 0 20px 0' };
      case 'middle':
        return { margin: '25px 0' };
      case 'bottom':
        return { margin: '20px 0 10px 0' };
      case 'sidebar':
        return { margin: '15px 0', maxWidth: '300px' };
      default:
        return { margin: '15px 0' };
    }
  };

  const adStyle = {
    ...getAdStyle(),
    ...getPositionStyle()
  };

  // Don't show if ad blocker detected
  if (!showAd) {
    return (
      <div style={adStyle}>
        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
          🔒 Ad blocker detected
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Global Ads Scripts - Load only once */}
      {position === 'top' && (
        <>
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
        </>
      )}

      {/* Ad Container */}
      <div style={adStyle} className={className}>
        {showLabel && (
          <div style={{
            fontSize: '0.7rem',
            color: '#64748b',
            marginBottom: '8px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            🔥 {adConfig.name}
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
              alignItems: 'center',
              minHeight: adConfig.height
            }}
          >
            {/* Ads automatically load here via PropellerAds scripts */}
            <div style={{
              color: '#94a3b8',
              fontSize: '0.8rem',
              fontStyle: 'italic'
            }}>
              Ad loading...
            </div>
          </div>
        ) : (
          <div style={{
            color: '#94a3b8',
            fontSize: '0.9rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '2px solid #e2e8f0',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Loading advertisement...
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

// Default props
AdsComponent.defaultProps = {
  type: 'banner',
  position: 'header',
  showLabel: true,
  className: ''
};

export default AdsComponent;
