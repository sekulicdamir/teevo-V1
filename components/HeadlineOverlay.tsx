
import React from 'react';
import type { NewsArticle } from '../types';

interface HeadlineOverlayProps {
  headline: NewsArticle;
}

export const HeadlineOverlay: React.FC<HeadlineOverlayProps> = ({ headline }) => {
  if (!headline) return null;

  return (
    <div className="w-full">
      <div className="flex items-start">
        <span className="bg-red-600 w-4 h-4 mr-3 mt-1.5 flex-shrink-0"></span>
        <div>
          <p className="text-3xl font-bold leading-tight font-sans">
            {headline.headline}
          </p>
          {headline.subHeadline && (
            <p className="text-xl text-gray-300 font-normal leading-tight font-sans mt-1">
              {headline.subHeadline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};