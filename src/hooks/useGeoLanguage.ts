import { useEffect } from 'react';
import i18n from 'i18next';

export const useGeoLanguage = () => {
  useEffect(() => {
    const detectLanguage = async () => {
      // 1. Check for test mode in URL (e.g. ?test=dubai or ?test=turkey)
      const urlParams = new URLSearchParams(window.location.search);
      const testMode = urlParams.get('test');
      
      // 2. Check if language is already set manually by the user
      const isManual = localStorage.getItem('i18nextLng_manual');
      if (isManual && !testMode) return;

      try {
        let countryCode = '';

        if (testMode === 'dubai') {
          countryCode = 'AE';
        } else if (testMode === 'turkey') {
          countryCode = 'TR';
        } else {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          countryCode = data.country_code;
        }

        console.log('Detected country:', countryCode);

        let detectedLng = 'en'; // Default is English for everyone including Turkey
        
        if (countryCode === 'AE' || countryCode === 'SA' || countryCode === 'QA' || countryCode === 'KW') {
          // Dubai (AE) and other Gulf countries -> Arabic
          detectedLng = 'ar';
        }

        // Only change if different from current
        if (detectedLng !== i18n.language) {
          i18n.changeLanguage(detectedLng);
        }
      } catch (error) {
        console.error('Error detecting geographic location:', error);
      }
    };

    detectLanguage();
  }, []);
};
