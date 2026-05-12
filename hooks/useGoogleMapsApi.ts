import { useState, useEffect } from 'react';
import { getMapsApiKey } from '../lib/mapsConfig';

declare global {
  interface Window {
    google: any;
    googleMapsApiLoaded?: boolean;
    onGoogleMapsApiReady?: () => void;
  }
}

let isLoadingScript = false;

export function useGoogleMapsApi() {
  const [isApiReady, setIsApiReady] = useState(!!window.googleMapsApiLoaded || !!window.google);

  useEffect(() => {
    if (isApiReady) return;

    const onReady = () => {
      window.googleMapsApiLoaded = true;
      setIsApiReady(true);
    };

    if (window.googleMapsApiLoaded || window.google) {
      onReady();
      return;
    }

    window.addEventListener('google-maps-api-ready', onReady);

    if (!isLoadingScript) {
        isLoadingScript = true;
        
        window.onGoogleMapsApiReady = () => {
            window.dispatchEvent(new Event('google-maps-api-ready'));
        };

        getMapsApiKey().then((key) => {
            if (!key) {
                console.warn('[RHIVE] Maps API key not found. Maps features will be disabled.');
                return;
            }
            
            if (document.querySelector('script[src*="maps.googleapis.com"]')) {
                return;
            }
            
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,drawing,geometry&callback=onGoogleMapsApiReady`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        });
    }
    
    return () => {
      window.removeEventListener('google-maps-api-ready', onReady);
    };
  }, [isApiReady]);

  return isApiReady;
}
