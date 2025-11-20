// components/SimpleAds.js - TRY THIS
const SimpleAds = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      margin: '20px 0',
      backgroundColor: '#f8fafc',
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      minHeight: '100px'
    }}>
      <div style={{ color: '#3b82f6', fontSize: '0.8rem', marginBottom: '10px' }}>
        🔥 Advertisement
      </div>
      
      {/* PropellerAds will automatically show ads here */}
      <div id="propeller-ads-container"></div>

      {/* Manual Script Injection */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Push Ads
            var pushScript = document.createElement('script');
            pushScript.src = 'https://3nbf4.com/act/files/tag.min.js?z=10209677';
            pushScript.setAttribute('data-cfasync', 'false');
            pushScript.async = true;
            document.head.appendChild(pushScript);
            
            // Native/Banner Ads
            var nativeScript = document.createElement('script');
            nativeScript.innerHTML = '(function(s){s.dataset.zone="10209689",s.src="https://nap5k.com/tag.min.js"})(document.createElement("script"));';
            document.head.appendChild(nativeScript);
            
            // Interstitial Ads  
            var interstitialScript = document.createElement('script');
            interstitialScript.innerHTML = '(function(s){s.dataset.zone="10209722",s.src="https://groleegni.net/vignette.min.js"})(document.createElement("script"));';
            document.head.appendChild(interstitialScript);
            
            console.log('All PropellerAds scripts injected');
          `,
        }}
      />
    </div>
  );
};

export default SimpleAds;
