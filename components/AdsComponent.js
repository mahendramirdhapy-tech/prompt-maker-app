// components/AdsComponent.js
import { useEffect, useState } from 'react';
import Script from 'next/script';

const AdsComponent = ({ type = 'banner', position = 'header' }) => {
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    // Ads load hone ke baad state update karein
    const timer = setTimeout(() => {
      setAdsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Different ad types ke liye different styles
  const getAdStyle = () => {
    const baseStyle = {
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '10px 0',
      borderRadius: '8px',
      overflow: 'hidden'
    };

    switch (type) {
      case 'banner':
        return {
          ...baseStyle,
          minHeight: '90px',
          padding: '10px 0',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0'
        };
      case 'interstitial':
        return {
          ...baseStyle,
          minHeight: '250px',
          padding: '20px 0',
          backgroundColor: '#f1f5f9',
          border: '1px solid #cbd5e1'
        };
      case 'native':
        return {
          ...baseStyle,
          minHeight: '120px',
          padding: '15px 0',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <>
      {/* Ads Scripts */}
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
      {adsLoaded && (
        <div style={getAdStyle()}>
          <div id={`propeller-ads-${type}-${position}`}></div>
        </div>
      )}
    </>
  );
};

export default AdsComponent;
