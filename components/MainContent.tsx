
import React from 'react';
import { VideoPlayer } from './VideoPlayer';
import { SidePanel } from './SidePanel';
import { HeadlineOverlay } from './HeadlineOverlay';
import type { Stream, WeatherData, NewsArticle, TravelRoute, TrafficCamera } from '../types';

interface MainContentProps {
  mainStream: Stream;
  weatherData: WeatherData | null;
  headline: NewsArticle;
  travelTimes: TravelRoute[];
  trafficCameras: TrafficCamera[];
  onStreamError: (streamId: string) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  mainStream,
  weatherData,
  headline,
  travelTimes,
  trafficCameras,
  onStreamError,
}) => {
  return (
    <div className="flex-grow flex flex-row h-full overflow-hidden">
      <div className="w-2/3 h-full relative bg-black">
        <VideoPlayer stream={mainStream} isMainPlayer={true} onStreamError={onStreamError} />
        <HeadlineOverlay headline={headline} />
      </div>
      <div className="w-1/3 h-full">
        <SidePanel weatherData={weatherData} travelTimes={travelTimes} trafficCameras={trafficCameras} />
      </div>
    </div>
  );
};