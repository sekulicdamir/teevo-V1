
import React from 'react';
import type { Stream } from '../types';

interface ChannelSelectorProps {
  streams: Stream[];
  currentStreamId: string;
  onSelectStream: (stream: Stream) => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({ streams, currentStreamId, onSelectStream }) => {
  return (
    <div className="bg-black/50 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      <div className="flex items-center space-x-2 overflow-x-auto">
        <span className="text-white font-bold text-sm mr-2 flex-shrink-0 uppercase font-sans tracking-wider">Channels</span>
        {streams.map(stream => (
          <button
            key={stream.id}
            onClick={() => onSelectStream(stream)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-in-out transform
              ${currentStreamId === stream.id
                ? 'bg-red-600 text-white scale-110 shadow-md ring-2 ring-white/50'
                : 'bg-gray-700/50 text-gray-200 hover:bg-gray-600/70 hover:text-white hover:scale-105'
              }
            `}
            aria-pressed={currentStreamId === stream.id}
          >
            {stream.title}
          </button>
        ))}
      </div>
    </div>
  );
};