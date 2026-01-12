
import React from 'react';
import { VideoPlayer } from './VideoPlayer';
import type { Stream } from '../types';

interface SecondaryStreamProps {
  stream: Stream;
}

export const SecondaryStream: React.FC<SecondaryStreamProps> = ({ stream }) => {
  return (
    <div className="bg-black rounded-lg shadow-sm overflow-hidden h-full">
      <VideoPlayer stream={stream} />
    </div>
  );
};
