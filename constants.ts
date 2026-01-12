
import type { Stream, WeatherData, NewsArticle, TravelRoute, Stock, TrafficCamera } from './types';
import { StreamType } from './types';

// Sample stream data. In a real app, this would come from a backend.
export const STREAMS: Stream[] = [
  { 
    id: '1', 
    title: 'CBC News (Toronto)', 
    type: StreamType.NEWS, 
    source: 'https://cbclive.akamaized.net/hls/live/2042858/LS_TO/master.m3u8',
    isPrimary: true, 
    playerType: 'hls',
    latitude: 43.6532, // Toronto
    longitude: -79.3832 
  },
  { 
    id: '2', 
    title: 'Sky News (UK)', 
    type: StreamType.NEWS, 
    source: 'https://video.news.sky.com/snc/live/v2/event/live-3/master.m3u8',
    playerType: 'hls',
    latitude: 51.5072, // London
    longitude: -0.1276
  },
  {
    id: '3',
    title: 'Al Jazeera (EN)',
    type: StreamType.NEWS,
    source: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
    playerType: 'hls',
    latitude: 25.2854, // Doha
    longitude: 51.5310
  },
  {
    id: '4',
    title: 'ABC News (AU)',
    type: StreamType.NEWS,
    source: 'https://abc-iview-mediapackagestreams.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8',
    playerType: 'hls',
    latitude: -33.8688, // Sydney
    longitude: 151.2093
  }
];

// Sample weather data
export const DEFAULT_WEATHER: WeatherData = {
  city: 'SCARBOROUGH',
  temperature: -1,
  feelsLike: -8,
  locationSpecificTemp: 0,
  condition: 'Cloudy',
  icon: 'cloud',
  forecast: [
    { day: 'MON', temp: 1, icon: 'cloud' },
    { day: 'TUE', temp: 3, icon: 'rain' },
    { day: 'WED', temp: 3, icon: 'rain' },
    { day: 'THU', temp: -8, icon: 'cloud-sun' },
    { day: 'FRI', temp: -4, icon: 'cloud-sun' },
  ],
};


// Sample news headlines
export const NEWS_HEADLINES: NewsArticle[] = [
  { id: 'n1', headline: 'Mattel adds an autistic Barbie to doll line devoted to showcasing diversity and inclusion.', source: 'Reuters' },
  { id: 'n2', headline: 'New environmental regulations announced by international committee.', source: 'AP' },
];

export const TRAVEL_TIMES: TravelRoute[] = [
    { id: 't2', name: 'DON VALLEY PKWY', location: 'BLOOR STREET', now: 25, normal: 15 },
];

export const TRAFFIC_CAMERAS: TrafficCamera[] = [
    { id: 'cam1', name: 'DOWNTOWN LIVE CAM', source: 'https://www.youtube.com/embed/1-iS7LArMPA?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0' },
];

export const STOCKS: Stock[] = [
    { id: 's1', symbol: 'WSP GLOBAL INC', price: 264.18, change: 4.16 },
    { id: 's2', symbol: 'PURPOSE SILVER BULLION', price: 62.94, change: 4.11 },
    { id: 's3', symbol: 'SPROTT INC.', price: 150.93, change: 4.08 },
    { id: 's4', symbol: 'TV', price: 1.50, change: 0.12 },
    { id: 's5', symbol: 'RDW', price: 10.38, change: -0.21 },
    { id: 's6', symbol: 'NIO', price: 4.88, change: 0.05 },
    { id: 's7', symbol: 'BAC', price: 54.88, change: -1.02 },
];

export const ALERT_MESSAGE = "SPECIAL WEATHER STATEMENT: Heavy rainfall expected across the region this evening. Minor flooding possible in low-lying areas.";