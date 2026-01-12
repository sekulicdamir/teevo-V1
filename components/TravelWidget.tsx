
import React from 'react';
import type { TravelRoute, TrafficCamera } from '../types';
import { ArrowUpIcon } from './Icons';
import { VideoPlayer } from './VideoPlayer';
import { StreamType } from '../types';

interface TravelWidgetProps {
  routes: TravelRoute[];
  cameras: TrafficCamera[];
}

export const TravelWidget: React.FC<TravelWidgetProps> = ({ routes, cameras }) => {
  return (
    <div className="bg-white text-black p-2 flex-grow flex flex-col font-display">
      <div className="text-center py-1">
        <p className="text-gray-500 text-sm font-sans">TEEVO.COM</p>
        <h2 className="text-xl font-bold border-b-2 border-black pb-1">TRAVEL TIMES RIGHT NOW</h2>
      </div>
      <div className="flex-grow flex flex-col justify-around">
        {cameras.map(camera => (
            <div key={camera.id} className="py-2 flex-grow flex flex-col">
                <div className="bg-green-600 text-white text-center py-1">
                    <h3 className="text-2xl font-bold">{camera.name}</h3>
                </div>
                <div className="flex-grow relative bg-black">
                     <VideoPlayer stream={{ id: camera.id, title: camera.name, source: camera.source, type: StreamType.TRAFFIC, playerType: 'iframe' }} />
                </div>
            </div>
        ))}

        {routes.map(route => (
          <div key={route.id} className="py-2">
            <div className="bg-green-600 text-white text-center py-1">
              <h3 className="text-2xl font-bold">{route.name}</h3>
            </div>
            <p className="text-center font-semibold text-lg my-1">{route.location}</p>
            <div className="flex justify-around text-center">
              <div className="bg-red-600 text-white p-2 w-28">
                <p className="font-bold text-lg">NOW</p>
                <p className="font-bold text-3xl">{route.now} <span className="text-lg">MIN</span></p>
              </div>
              <div className="bg-black text-white p-2 w-28">
                <p className="font-bold text-lg">NORMAL</p>
                <p className="font-bold text-3xl">{route.normal} <span className="text-lg">MIN</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-300 text-black px-2 py-1 flex justify-between items-center font-sans font-bold text-lg border-t-2 border-gray-400">
        <div className="flex items-baseline">
            <span className="mr-4 text-sm">OIL</span>
            <span>59.25</span>
        </div>
        <div className="flex items-center">
            <ArrowUpIcon className="w-5 h-5 text-green-600 mr-1" />
            <span>0.13</span>
        </div>
      </div>
    </div>
  );
};