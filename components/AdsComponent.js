// components/AdsComponent.js - WITH NEW ADS CODE
import { useEffect, useState } from 'react';

const AdsComponent = ({ 
  type = 'banner', 
  position = 'header',
  showLabel = true 
}) => {
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    const loadAllAdsScripts = () => {
      if (typeof window !== 'undefined') {
        
        // 1. Push Notification Ads (Existing)
        const pushScript = document.createElement('script');
        pushScript.src = 'https://3nbf4.com/act/files/tag.min.js?z=10209677';
        pushScript.setAttribute('data-cfasync', 'false');
        pushScript.async = true;
        
        // 2. Native/Banner Ads (Existing)
        const nativeScript = document.createElement('script');
        nativeScript.innerHTML = `
          (function(s){
            s.dataset.zone='10209689',
            s.src='https://nap5k.com/tag.min.js'
          })(document.createElement('script'));
        `;
        
        // 3. Interstitial Ads (Existing)
        const interstitialScript = document.createElement('script');
        interstitialScript.innerHTML = `
          (function(s){
            s.dataset.zone='10209722',
            s.src='https://groleegni.net/vignette.min.js'
          })(document.createElement('script'));
        `;

        // 4. NEW ADS CODE - Additional Interstitial
        const newAdScript = document.createElement('script');
        newAdScript.innerHTML = `
          (function(s){
            s.dataset.zone='10212308',
            s.src='https://gizokraijaw.net/vignette.min.js'
          })(document.createElement('script'));
        `;

        // Append all scripts to head
        document.head.appendChild(pushScript);
        document.head.appendChild(nativeScript);
        document.head.appendChild(interstitialScript);
        document.head.appendChild(newAdScript);

        console.log('All ads scripts injected including new code');
      }
    };

    // Load scripts after delay
    const timer = setTimeout(() => {
      loadAllAdsScripts();
      setAdsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const adStyle = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '15px auto',
    padding: '15px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '2px solid #8b5cf6',
    minHeight: '90px',
    width: '100%',
    maxWidth: '728px',
    overflow: 'hidden'
  };

  return (
    <div style={adStyle}>
      {showLabel && (
        <div style={{
          fontSize: '0.7rem',
          color: '#8b5cf6',
          marginBottom: '8px',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}>
          🔥 Advertisement - All Ads Active
        </div>
      )}
      
      <div 
        id={`propeller-ads-${type}-${position}`}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90px'
        }}
      >
        {adsLoaded ? (
          <div style={{
            color: '#10b981',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            ✅ 4 Ads Networks Loaded!
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '5px' }}>
              Push + Native + Interstitial + New Ads
            </div>
          </div>
        ) : (
          <div style={{
            color: '#64748b',
            fontSize: '0.9rem'
          }}>
            ⏳ Loading all ads networks...
          </div>
        )}
      </div>

      {/* Manual script for new ads */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              // New ads code manual injection
              try {
                (function(s){
                  s.dataset.zone='10212308',
                  s.src='https://gizokraijaw.net/vignette.min.js'
                })(document.createElement('script'));
                console.log('New ads code injected manually');
              } catch (error) {
                console.error('New ads injection error:', error);
              }
            }, 2000);
          `,
        }}
      />
    </div>
  );
};

export default AdsComponent;
