
import React from 'react';

interface AlertBarProps {
  message: string;
}

export const AlertBar: React.FC<AlertBarProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-600 text-white w-full overflow-hidden flex whitespace-nowrap font-sans h-10 items-center">
      <div className="flex-grow relative overflow-hidden">
        <div className="absolute top-0 left-0 w-max h-full flex items-center animate-scroll">
          {/* Using a wrapper for spacing and repeating */}
          <div className="flex items-center px-4">
            <span className="uppercase font-bold text-sm bg-yellow-400 text-black px-2 py-0.5 mr-4 rounded-sm">Alert</span>
            <span className="font-semibold text-base">{message}</span>
          </div>
          {/* Duplicate for seamless scroll */}
           <div className="flex items-center px-4">
            <span className="uppercase font-bold text-sm bg-yellow-400 text-black px-2 py-0.5 mr-4 rounded-sm">Alert</span>
            <span className="font-semibold text-base">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
