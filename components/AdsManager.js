// components/AdsManager.js - For managing multiple ads
import AdsComponent from './AdsComponent';

const AdsManager = ({ page = 'home', layout = 'default' }) => {
  // Different ad configurations for different pages
  const getAdsConfig = () => {
    const configs = {
      home: [
        { type: 'banner', position: 'top', showLabel: true },
        { type: 'native', position: 'middle', showLabel: false },
        { type: 'banner', position: 'pre-footer', showLabel: true }
      ],
      tools: [
        { type: 'native', position: 'sidebar', showLabel: true },
        { type: 'banner', position: 'bottom', showLabel: false }
      ],
      blog: [
        { type: 'native', position: 'in-content', showLabel: true },
        { type: 'interstitial', position: 'popup', showLabel: false }
      ]
    };

    return configs[page] || configs.home;
  };

  const adsConfig = getAdsConfig();

  return (
    <>
      {adsConfig.map((ad, index) => (
        <AdsComponent
          key={`${ad.type}-${ad.position}-${index}`}
          type={ad.type}
          position={ad.position}
          showLabel={ad.showLabel}
        />
      ))}
    </>
  );
};

export default AdsManager;
