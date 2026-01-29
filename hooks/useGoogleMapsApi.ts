import { useState, useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleMapsApiLoaded?: boolean;
  }
}

export function useGoogleMapsApi() {
  const [isApiReady, setIsApiReady] = useState(!!window.googleMapsApiLoaded);

  useEffect(() => {
    if (isApiReady) return;

    const onReady = () => setIsApiReady(true);

    if (window.googleMapsApiLoaded) {
      onReady();
      return;
    }
    
    window.addEventListener('google-maps-api-ready', onReady);
    
    return () => {
      window.removeEventListener('google-maps-api-ready', onReady);
    };
  }, [isApiReady]);

  return isApiReady;
}
