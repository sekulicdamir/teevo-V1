
import React, { useState, useEffect } from 'react';
import type { WeatherData, WeatherIconType } from '../types';
import { SunIcon, CloudIcon, RainIcon, SnowIcon, SettingsIcon } from './Icons';

interface WeatherWidgetProps {
  data: WeatherData;
}

const WeatherIcon: React.FC<{ type: WeatherIconType, className?: string }> = ({ type, className = 'w-8 h-8' }) => {
    switch (type) {
        case 'sun': return <SunIcon className={className} />;
        case 'cloud': return <CloudIcon className={className} />;
        case 'cloud-sun':
             return (
                <div className="relative flex items-center justify-center w-full h-full">
                    <SunIcon className={'w-full h-full text-yellow-300'} />
                    <CloudIcon className={'w-3/4 h-3/4 absolute text-gray-300'} />
                </div>
            );
        case 'rain': return <RainIcon className={className} />;
        case 'snow': return <SnowIcon className={className} />;
        default: return <CloudIcon className={className} />;
    }
};


export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dayMonth = ((d) => `${d.toLocaleDateString([], { weekday: 'short' })} ${d.toLocaleDateString([], { month: 'short' })} ${d.getDate()}`)(date);


  return (
    <div className="font-display text-white">
      {/* Top red bar */}
      <div className="bg-red-700 p-2 flex justify-between items-center">
        <div className="text-3xl font-black tracking-tighter">
            TEEVO
        </div>
        <div className="text-lg font-bold text-right">{dayMonth.toUpperCase()}</div>
        <button className="p-1" aria-label="Settings">
            <SettingsIcon className="w-8 h-8 text-white" />
        </button>
      </div>
      
      {/* Time and Feels Like bar */}
      <div className="bg-white text-black flex justify-between items-center px-2 py-0">
        <p className="text-4xl font-bold tracking-tighter">{time}</p>
        <div className="text-right">
            <p className="text-xs font-semibold">FEELS LIKE</p>
            <p className="text-lg font-bold">{data.feelsLike}°</p>
        </div>
      </div>
      
      {/* Forecast */}
      <div className="bg-blue-600 p-2">
        <div className="flex justify-around text-center">
            {data.forecast.map(item => (
                <div key={item.day} className="w-1/5">
                    <p className="font-bold text-lg">{item.day}</p>
                    <div className="my-1 mx-auto flex justify-center h-10 w-10 items-center">
                        <WeatherIcon type={item.icon} className="w-full h-full" />
                    </div>
                    <p className="font-bold text-2xl">{item.temp}°</p>
                </div>
            ))}
        </div>
      </div>
      <div className="bg-white text-black text-center py-1 flex justify-center items-baseline">
        <p className="font-bold text-lg">{data.city.toUpperCase()}</p>
        <p className="font-bold text-2xl ml-4">{data.locationSpecificTemp}°</p>
      </div>
    </div>
  );
};