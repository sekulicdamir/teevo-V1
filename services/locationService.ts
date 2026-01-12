
import type { Location } from '../types';

export const getLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
    } else {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Using OpenStreetMap's Nominatim API for reverse geocoding.
            // This is a free service with a usage policy. For a production app,
            // a dedicated geocoding service with an API key is recommended.
            // See policy: https://operations.osmfoundation.org/policies/nominatim/
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
            
            if (!response.ok) {
              throw new Error(`Reverse geocoding failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
              throw new Error(`Reverse geocoding error: ${data.error}`);
            }

            // Extract city from the address components, with fallbacks
            const city = data.address.city || data.address.town || data.address.village || 'Unknown Area';
            const country = data.address.country_code ? data.address.country_code.toUpperCase() : 'N/A';

            resolve({
              latitude,
              longitude,
              city,
              country,
            });
          } catch (error) {
            console.error("Geocoding Error:", error);
            // Fallback gracefully if the API fails
            reject(new Error('Could not determine your city from your location.'));
          }
        },
        () => {
          reject(new Error('Unable to retrieve your location. Please enable location services.'));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  });
};
