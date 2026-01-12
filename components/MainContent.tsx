
import React from 'react';
import { VideoPlayer } from './VideoPlayer';
import { SidePanel } from './SidePanel';
import { HeadlineOverlay } from './HeadlineOverlay';
import type { Stream, WeatherData, NewsArticle, TravelRoute, TrafficCamera } from '../types';

interface MainContentProps {
  mainStream: Stream;
  weatherData: WeatherData | null;
  headlines: NewsArticle[];
  travelTimes: TravelRoute[];
  trafficCameras: TrafficCamera[];
  toggleSettings: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  mainStream,
  weatherData,
  headlines,
  travelTimes,
  trafficCameras,
  toggleSettings,
}) => {
  return (
    <div className="flex-grow flex flex-row h-full overflow-hidden">
      <div className="w-2/3 h-full flex flex-col bg-black">
        <div className="w-full aspect-video">
            <VideoPlayer stream={mainStream} isMainPlayer={true} />
        </div>
        <div className="bg-white text-black flex items-center justify-center py-1">
            <h2 className="text-4xl font-black tracking-tighter">TEEVO</h2>
        </div>
        <div className="w-full flex-grow flex flex-col p-4 overflow-hidden">
            <div className="flex-grow">
              <HeadlineOverlay headlines={headlines} />
            </div>
        </div>
      </div>
      <div className="w-1/3 h-full">
        <SidePanel 
          weatherData={weatherData} 
          travelTimes={travelTimes} 
          trafficCameras={trafficCameras}
          toggleSettings={toggleSettings} 
        />
      </div>
    </div>
  );
};