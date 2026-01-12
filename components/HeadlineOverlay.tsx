
import React from 'react';
import type { NewsArticle } from '../types';

interface HeadlineOverlayProps {
  headline: NewsArticle;
}

export const HeadlineOverlay: React.FC<HeadlineOverlayProps> = ({ headline }) => {
  if (!headline) return null;

  return (
    <div className="absolute bottom-[3.5rem] left-4 bg-black/70 p-3 text-white max-w-lg rounded">
      <div className="flex items-start">
        <span className="bg-red-600 w-4 h-4 mr-3 mt-1.5 flex-shrink-0"></span>
        <p className="text-2xl font-bold leading-tight font-sans">
          {headline.headline}
        </p>
      </div>
    </div>
  );
};
