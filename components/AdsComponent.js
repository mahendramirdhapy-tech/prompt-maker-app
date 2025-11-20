// components/AdsComponent.js - WORKING VERSION
import { useEffect, useState } from 'react';

const AdsComponent = ({ 
  type = 'banner', 
  position = 'header',
  showLabel = true 
}) => {
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    const loadAdsScripts = () => {
      if (typeof window !== 'undefined') {
        console.log('Loading PropellerAds scripts...');
        
        // 1. Push Notification Ads
        try {
          const pushScript = document.createElement('script');
          pushScript.src = 'https://3nbf4.com/act/files/tag.min.js?z=10209677';
          pushScript.setAttribute('data-cfasync', 'false');
          pushScript.async = true;
          document.head.appendChild(pushScript);
          console.log('Push ads script loaded');
        } catch (error) {
          console.error('Push ads error:', error);
        }

        // 2. Native/Banner Ads
        try {
          const nativeScript = document.createElement('script');
          nativeScript.innerHTML = `
            (function(s){
              s.dataset.zone = '10209689';
              s.src = 'https://nap5k.com/tag.min.js';
              document.head.appendChild(s);
            })(document.createElement('script'));
          `;
          document.head.appendChild(nativeScript);
          console.log('Native ads script loaded');
        } catch (error) {
          console.error('Native ads error:', error);
        }

        // 3. Interstitial Ads
        try {
          const interstitialScript = document.createElement('script');
          interstitialScript.innerHTML = `
            (function(s){
              s.dataset.zone = '10209722';
              s.src = 'https://groleegni.net/vignette.min.js';
              document.head.appendChild(s);
            })(document.createElement('script'));
          `;
          document.head.appendChild(interstitialScript);
          console.log('Interstitial ads script loaded');
        } catch (error) {
          console.error('Interstitial ads error:', error);
        }

        // 4. NEW Interstitial Ads
        try {
          const newAdScript = document.createElement('script');
          newAdScript.innerHTML = `
            (function(s){
              s.dataset.zone = '10212308';
              s.src = 'https://gizokraijaw.net/vignette.min.js';
              document.head.appendChild(s);
            })(document.createElement('script'));
          `;
          document.head.appendChild(newAdScript);
          console.log('New interstitial ads script loaded');
        } catch (error) {
          console.error('New interstitial ads error:', error);
        }
      }
    };

    // Load scripts
    loadAdsScripts();
    setAdsLoaded(true);

  }, []);

  const adStyle = {
    textAlign: 'center',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f0f9ff',
    border: '2px solid #0369a1',
    borderRadius: '12px',
    minHeight: '100px',
    width: '100%',
    maxWidth: '728px'
  };

  return (
    <>
      {/* Manual Script Injection as Backup */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Backup manual injection
            setTimeout(function() {
              try {
                // Push Ads
                var s1 = document.createElement('script');
                s1.src = 'https://3nbf4.com/act/files/tag.min.js?z=10209677';
                s1.setAttribute('data-cfasync', 'false');
                s1.async = true;
                document.head.appendChild(s1);
                
                // Native Ads
                var s2 = document.createElement('script');
                s2.innerHTML = '(function(s){s.dataset.zone="10209689",s.src="https://nap5k.com/tag.min.js"})(document.createElement("script"));';
                document.head.appendChild(s2);
                
                // Interstitial Ads
                var s3 = document.createElement('script');
                s3.innerHTML = '(function(s){s.dataset.zone="10209722",s.src="https://groleegni.net/vignette.min.js"})(document.createElement("script"));';
                document.head.appendChild(s3);
                
                // New Interstitial Ads
                var s4 = document.createElement('script');
                s4.innerHTML = '(function(s){s.dataset.zone="10212308",s.src="https://gizokraijaw.net/vignette.min.js"})(document.createElement("script"));';
                document.head.appendChild(s4);
                
                console.log('All ads scripts injected via backup method');
              } catch (error) {
                console.error('Backup injection error:', error);
              }
            }, 1000);
          `,
        }}
      />

      <div style={adStyle}>
        {showLabel && (
          <div style={{
            fontSize: '0.8rem',
            color: '#0369a1',
            marginBottom: '10px',
            fontWeight: '600'
          }}>
            🔥 Ads Active - All Networks
          </div>
        )}
        
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60px'
        }}>
          {adsLoaded ? (
            <div style={{
              color: '#059669',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              ✅ All Ads Networks Loaded!
              <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '5px' }}>
                4 Networks: Push + Native + Interstitial x2
              </div>
            </div>
          ) : (
            <div style={{ color: '#475569' }}>
              ⏳ Loading advertisements...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdsComponent;
