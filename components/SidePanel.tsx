
import React from 'react';
import { WeatherWidget } from './WeatherWidget';
import { TravelWidget } from './TravelWidget';
import type { TravelRoute, WeatherData, TrafficCamera } from '../types';

interface SidePanelProps {
  weatherData: WeatherData | null;
  travelTimes: TravelRoute[];
  trafficCameras: TrafficCamera[];
}

export const SidePanel: React.FC<SidePanelProps> = ({ weatherData, travelTimes, trafficCameras }) => {
  return (
    <div className="h-full flex flex-col">
      {weatherData && <WeatherWidget data={weatherData} />}
      <TravelWidget routes={travelTimes} cameras={trafficCameras} />
    </div>
  );
};
