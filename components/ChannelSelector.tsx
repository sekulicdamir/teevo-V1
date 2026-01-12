
import React from 'react';
import type { Stream } from '../types';

interface ChannelSelectorProps {
  streams: Stream[];
  currentStreamId: string;
  onSelectStream: (stream: Stream) => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({ streams, currentStreamId, onSelectStream }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 overflow-x-auto">
        {streams.map(stream => (
          <button
            key={stream.id}
            onClick={() => onSelectStream(stream)}
            className={`px-3 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors duration-200
              ${currentStreamId === stream.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }
            `}
          >
            {stream.title}
          </button>
        ))}
      </div>
    </div>
  );
};
