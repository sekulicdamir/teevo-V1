
import React, { useState, useEffect } from 'react';
import type { NewsArticle } from '../types';

interface HeadlineOverlayProps {
  headlines: NewsArticle[];
}

export const HeadlineOverlay: React.FC<HeadlineOverlayProps> = ({ headlines }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Reset to the first headline if the list itself changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [headlines]);

  useEffect(() => {
    if (!headlines || headlines.length < 2) return;

    const intervalId = setInterval(() => {
      setIsFading(true); // Start fade out

      // Wait for fade-out transition to complete before changing content
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length);
        setIsFading(false); // Start fade in with new content
      }, 500); // This duration should match the CSS fade-out duration

    }, 8000); // Change headline every 8 seconds

    return () => clearInterval(intervalId);
  }, [headlines]);

  if (!headlines || headlines.length === 0) {
    return null;
  }

  const currentHeadline = headlines[currentIndex];
  if (!currentHeadline) return null; // Safety check

  return (
    <div className="w-full h-full flex flex-col overflow-hidden pr-2">
      <div
        key={currentHeadline.id || `headline-${currentIndex}`}
        className={`transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="flex items-start">
          <span className="bg-red-600 w-4 h-4 mr-3 mt-1.5 flex-shrink-0"></span>
          <div>
            <p className="text-3xl font-bold leading-tight font-sans">
              {currentHeadline.headline}
            </p>
            {currentHeadline.subHeadline && (
              <p className="text-xl text-gray-300 font-normal leading-tight font-sans mt-1">
                {currentHeadline.subHeadline}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};