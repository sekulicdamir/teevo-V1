
export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export enum StreamType {
  NEWS = 'News',
  TRAFFIC = 'Traffic',
  WEATHER = 'Weather',
}

export interface Stream {
  id: string;
  title: string;
  type: StreamType;
  source: string;
  isPrimary?: boolean;
  playerType: 'iframe' | 'hls';
  latitude?: number;
  longitude?: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  locationSpecificTemp: number;
  condition: string;
  icon: WeatherIconType;
  forecast: {
    day: string;
    temp: number;
    icon: WeatherIconType;
  }[];
}

export type WeatherIconType = 'sun' | 'cloud' | 'rain' | 'snow' | 'wind' | 'cloud-sun';

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
}

export interface TravelRoute {
    id: string;
    name: string;
    location: string;
    now: number; // minutes
    normal: number; // minutes
}

export interface TrafficCamera {
  id: string;
  name: string;
  source: string;
}

export interface Stock {
    id: string;
    symbol: string;
    price: number;
    change: number;
}