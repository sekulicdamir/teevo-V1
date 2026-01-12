
import React, { useState, useEffect } from 'react';
import { MainContent } from './components/MainContent';
import { Ticker } from './components/Ticker';
import { AlertBar } from './components/AlertBar';
import type { Location, Stream, WeatherData, NewsArticle, TravelRoute, Stock, TrafficCamera } from './types';
import { getLocation } from './services/locationService';
import { getStreams } from './services/streamService';
import { getWeatherData } from './services/weatherService';
import { getNewsHeadlines } from './services/newsService';
import { getTravelTimes } from './services/travelService';
import { getStocks } from './services/stockService';
import { getTrafficCameras } from './services/trafficService';
import { ALERT_MESSAGE } from './constants';

const App: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [allStreams, setAllStreams] = useState<Stream[]>([]);
  const [mainStream, setMainStream] = useState<Stream | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [newsHeadlines, setNewsHeadlines] = useState<NewsArticle[]>([]);
  const [travelTimes, setTravelTimes] = useState<TravelRoute[]>([]);
  const [trafficCameras, setTrafficCameras] = useState<TrafficCamera[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [failedStreamIds, setFailedStreamIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.documentElement.classList.add('dark'); // Force dark mode
    const fetchData = async () => {
      try {
        const userLocation = await getLocation();
        setLocation(userLocation);
        const streams = getStreams(userLocation);
        setAllStreams(streams);
        if(streams.length > 0) {
            setMainStream(streams.find(s => s.isPrimary) || streams[0]);
        }
        const weather = await getWeatherData(userLocation);
        setWeatherData(weather);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
        // Fallback to default data
        const streams = getStreams(null);
        setAllStreams(streams);
        if (streams.length > 0) {
            setMainStream(streams.find(s => s.isPrimary) || streams[0]);
        }
        const weather = await getWeatherData(null);
        setWeatherData(weather);
      } finally {
        // Data that doesn't depend on location
        setNewsHeadlines(getNewsHeadlines());
        setTravelTimes(getTravelTimes());
        setTrafficCameras(getTrafficCameras());
        setStocks(getStocks());
      }
    };

    fetchData();
  }, []);

  const handleStreamError = (failedStreamId: string) => {
    setFailedStreamIds(prevFailedIds => {
        if (prevFailedIds.has(failedStreamId)) {
            return prevFailedIds;
        }

        const newFailedIds = new Set(prevFailedIds);
        newFailedIds.add(failedStreamId);

        const currentIndex = allStreams.findIndex(s => s.id === failedStreamId);
        if (currentIndex === -1) return newFailedIds;

        for (let i = 1; i < allStreams.length; i++) {
            const nextIndex = (currentIndex + i) % allStreams.length;
            const potentialNextStream = allStreams[nextIndex];
            if (!newFailedIds.has(potentialNextStream.id)) {
                console.log(`Stream ${failedStreamId} failed. Switching to ${potentialNextStream.title}`);
                setMainStream(potentialNextStream);
                return newFailedIds;
            }
        }

        console.error("All streams have failed.");
        setError("All available news streams seem to be offline. Please try again later.");
        return newFailedIds;
    });
  };

  if (!mainStream || newsHeadlines.length === 0 || stocks.length === 0 || !weatherData || travelTimes.length === 0) {
    return (
        <div className="bg-black text-white flex items-center justify-center h-screen">
            <div className="text-center font-display">
                <h1 className="text-3xl font-bold mb-4">Loading TEEVO...</h1>
                {error && <p className="text-red-400 mt-2">{error}</p>}
            </div>
        </div>
    );
  }

  return (
    <div className="bg-black text-gray-100 h-screen font-display flex flex-col overflow-hidden">
      <MainContent
        mainStream={mainStream}
        weatherData={weatherData}
        headline={newsHeadlines[0]}
        travelTimes={travelTimes}
        trafficCameras={trafficCameras}
        onStreamError={handleStreamError}
      />
      <Ticker stocks={stocks} />
      <AlertBar message={ALERT_MESSAGE} />
    </div>
  );
};

export default App;