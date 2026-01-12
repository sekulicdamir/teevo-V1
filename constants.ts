
import type { Stream, WeatherData, NewsArticle, TravelRoute, Stock, TrafficCamera } from './types';
import { StreamType } from './types';

// Stream data is now sourced from reliable, 24/7 YouTube Live channels.
// The primary stream is set to a reliable YouTube source to prevent player failure.
export const STREAMS: Stream[] = [
  {
    id: '5',
    title: 'RTCG 1',
    type: StreamType.NEWS,
    source: 'https://rtcg-live-open-geo.morescreens.com/RTCG_1_001/playlist.m3u8',
    isPrimary: true,
    playerType: 'hls',
  },
  { 
    id: '1', 
    title: 'Sky News', 
    type: StreamType.NEWS, 
    source: 'https://www.youtube.com/embed/9Auq9mYxFEE?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1',
    isPrimary: false, 
    playerType: 'iframe',
  },
  { 
    id: '2', 
    title: 'Al Jazeera', 
    type: StreamType.NEWS, 
    source: 'https://www.youtube.com/embed/gCNeDWCI0vo?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1',
    playerType: 'iframe',
  },
  {
    id: '3',
    title: 'France 24',
    type: StreamType.NEWS,
    source: 'https://www.youtube.com/embed/h3MuIUNCCzI?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1',
    playerType: 'iframe',
  },
  {
    id: '4',
    title: 'Bloomberg TV',
    type: StreamType.NEWS,
    source: 'https://www.youtube.com/embed/dp8PhLsUcFE?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1',
    playerType: 'iframe',
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


// Fallback message if the live news feed fails.
export const NEWS_HEADLINES: NewsArticle[] = [
  { 
    id: 'fallback-1', 
    headline: 'Could Not Load Live News Feed', 
    subHeadline: 'The news source may be temporarily unavailable. Please try again later.', 
    source: 'System' 
  },
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