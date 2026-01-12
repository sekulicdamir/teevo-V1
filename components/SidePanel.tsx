
import React from 'react';
import { WeatherWidget } from './WeatherWidget';
import { TravelWidget } from './TravelWidget';
import type { TravelRoute, WeatherData, TrafficCamera } from '../types';

interface SidePanelProps {
  weatherData: WeatherData | null;
  travelTimes: TravelRoute[];
  trafficCameras: TrafficCamera[];
  toggleSettings: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ weatherData, travelTimes, trafficCameras, toggleSettings }) => {
  return (
    <div className="h-full flex flex-col">
      {weatherData && <WeatherWidget data={weatherData} toggleSettings={toggleSettings} />}
      <TravelWidget routes={travelTimes} cameras={trafficCameras} />
    </div>
  );
};