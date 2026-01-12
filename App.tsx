
import React, { useState, useEffect } from 'react';
import { MainContent } from './components/MainContent';
import { Ticker } from './components/Ticker';
import { AlertBar } from './components/AlertBar';
import { SettingsPanel } from './components/SettingsPanel';
import type { Location, Stream, WeatherData, NewsArticle, TravelRoute, Stock, TrafficCamera } from './types';
import { getLocation } from './services/locationService';
import { getStreams } from './services/streamService';
import { getWeatherData } from './services/weatherService';
import { getNewsHeadlines, getLiveNewsHeadlines } from './services/newsService';
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playerVolume, setPlayerVolume] = useState(0.0); // Start muted

  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };

  useEffect(() => {
    document.documentElement.classList.add('dark'); // Force dark mode
    const fetchData = async () => {
      // Fetch non-location dependent data immediately
      setTravelTimes(getTravelTimes());
      setTrafficCameras(getTrafficCameras());
      setStocks(getStocks());

      try {
        const userLocation = await getLocation();
        setLocation(userLocation);
        
        // Fetch all location-dependent data
        const streams = getStreams(userLocation);
        setAllStreams(streams);
        if(streams.length > 0) {
            setMainStream(streams.find(s => s.isPrimary) || streams[0]);
        }
        const weather = await getWeatherData(userLocation);
        setWeatherData(weather);

        // Fetch initial live headlines using location
        const headlines = await getLiveNewsHeadlines(userLocation);
        setNewsHeadlines(headlines);

      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
        // Fallback to default data for location-dependent services
        const streams = getStreams(null);
        setAllStreams(streams);
        if (streams.length > 0) {
            setMainStream(streams.find(s => s.isPrimary) || streams[0]);
        }
        const weather = await getWeatherData(null);
        setWeatherData(weather);
        // Use static headlines as fallback
        setNewsHeadlines(getNewsHeadlines());
      }
    };

    fetchData();
  }, []);

  // Effect for refreshing headlines every 3 minutes once location is available
  useEffect(() => {
    if (!location) return;

    const fetchLatestHeadlines = async () => {
        console.log('Refreshing headlines...');
        const headlines = await getLiveNewsHeadlines(location);
        setNewsHeadlines(headlines);
    };

    const intervalId = setInterval(fetchLatestHeadlines, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(intervalId);
  }, [location]);

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
    <div className="bg-black text-gray-100 h-screen font-display flex flex-col overflow-hidden relative">
      <MainContent
        mainStream={mainStream}
        weatherData={weatherData}
        headlines={newsHeadlines}
        travelTimes={travelTimes}
        trafficCameras={trafficCameras}
        toggleSettings={toggleSettings}
        playerVolume={playerVolume}
      />
      <Ticker stocks={stocks} />
      <AlertBar message={ALERT_MESSAGE} />
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={toggleSettings}
        streams={allStreams}
        playerVolume={playerVolume}
        onPlayerVolumeChange={setPlayerVolume}
      />
    </div>
  );
};

export default App;