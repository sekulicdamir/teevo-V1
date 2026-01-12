
import type { Location, WeatherData, WeatherIconType } from '../types';
import { DEFAULT_WEATHER } from '../constants';

const mapWmoCodeToIcon = (code: number): WeatherIconType => {
  if (code === 0) return 'sun';
  if ([1, 2, 3].includes(code)) return 'cloud-sun';
  if ([45, 48].includes(code)) return 'cloud'; // Fog
  if (code >= 51 && code <= 67) return 'rain'; // Drizzle and Rain
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain'; // Rain showers
  if (code >= 85 && code <= 86) return 'snow'; // Snow showers
  if (code >= 95) return 'rain'; // Thunderstorm
  return 'cloud'; // Default for other codes
};

const mapWmoCodeToCondition = (code: number): string => {
    const wmoCodes: { [key: number]: string } = {
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Rime Fog',
        51: 'Light Drizzle', 53: 'Drizzle', 55: 'Dense Drizzle',
        56: 'Light Freezing Drizzle', 57: 'Dense Freezing Drizzle',
        61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
        66: 'Light Freezing Rain', 67: 'Heavy Freezing Rain',
        71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
        80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
        85: 'Light Snow Showers', 86: 'Heavy Snow Showers',
        95: 'Thunderstorm', 96: 'Thunderstorm, Hail', 99: 'Thunderstorm, Heavy Hail',
    };
    return wmoCodes[code] || 'Mixed';
};


// Fetches live weather data from the Open-Meteo API.
export const getWeatherData = async (location: Location | null): Promise<WeatherData> => {
  console.log('Fetching live weather for location:', location);
  
  if (!location) {
    return DEFAULT_WEATHER;
  }

  const { latitude, longitude, city } = location;
  // Using Open-Meteo API, which is free and requires no API key.
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max&timezone=auto&forecast_days=5`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Weather API failed with status: ${response.status}`);
    }
    const data = await response.json();

    if (!data.current || !data.daily || !data.daily.time) {
        throw new Error('Invalid data structure from weather API');
    }
    
    const forecast = data.daily.time.slice(0, 5).map((dateStr: string, index: number): { day: string; temp: number; icon: WeatherIconType; } => {
        const d = new Date(dateStr);
        // Get day of the week in the local timezone of the browser
        const day = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: data.timezone }).toUpperCase();
        const temp = Math.round(data.daily.temperature_2m_max[index]);
        const icon = mapWmoCodeToIcon(data.daily.weather_code[index]);
        return { day, temp, icon };
    });

    const weatherData: WeatherData = {
        city: city.toUpperCase(),
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        locationSpecificTemp: Math.round(data.current.temperature_2m),
        condition: mapWmoCodeToCondition(data.current.weather_code),
        icon: mapWmoCodeToIcon(data.current.weather_code),
        forecast: forecast,
    };
    
    return weatherData;

  } catch (error) {
    console.error("Failed to fetch live weather data:", error);
    // Fallback to default data if the API call fails
    return {
        ...DEFAULT_WEATHER,
        city: city.toUpperCase(), // At least show the correct city name
    };
  }
};