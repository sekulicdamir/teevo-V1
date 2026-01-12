
import React, { useState, useEffect, useRef } from 'react';
import type { Stream } from '../types';
import { CloseIcon } from './Icons';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  streams: Stream[];
  playerVolume: number;
  onPlayerVolumeChange: (newVolume: number) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, streams, playerVolume, onPlayerVolumeChange }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to manage the audio playback based on the toggle state.
  useEffect(() => {
    // The YouTube URL provided in the prompt is not a direct audio stream and cannot be used with the HTML Audio element.
    // A direct, public MP3 stream is used instead to fulfill the music feature request.
    // Switched to HTTPS to prevent mixed-content issues that block audio playback on secure pages.
    const musicSource = 'https://stream.lofi.lat/lofi';

    if (!audioRef.current) {
        audioRef.current = new Audio(musicSource);
        audioRef.current.loop = true;
        audioRef.current.volume = musicVolume;
    }

    if (isMusicPlaying) {
      audioRef.current.play().catch(error => console.error("Audio playback failed:", error));
    } else {
      audioRef.current.pause();
    }
    
    // Cleanup function to pause audio when the component unmounts
    return () => {
        audioRef.current?.pause();
    };

  }, [isMusicPlaying]);

  const handleMusicVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setMusicVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handlePlayerVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPlayerVolumeChange(parseFloat(event.target.value));
  };


  return (
    <div
      className={`fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-gray-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex flex-col h-full font-sans">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700"
              aria-label="Close settings"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Settings Content */}
          <div className="flex-grow p-6 overflow-y-auto space-y-8">
            {/* Language Selector */}
            <div>
              <label htmlFor="language-select" className="block text-lg font-semibold mb-2 text-gray-300">Language</label>
              <select
                id="language-select"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option>English</option>
                <option>Montenegrin (Auto-translated)</option>
              </select>
            </div>

            {/* Channel Selector */}
            <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Channels</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {streams.map(stream => (
                        <div key={stream.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                            <span>{stream.title}</span>
                            <input type="checkbox" className="h-5 w-5 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500" defaultChecked />
                        </div>
                    ))}
                </div>
            </div>

            {/* Location Selector */}
            <div>
                <label htmlFor="location-input" className="block text-lg font-semibold mb-2 text-gray-300">Location</label>
                <div className="flex space-x-2">
                    <input
                        id="location-input"
                        type="text"
                        placeholder="e.g., Podgorica, MNE"
                        className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                    <button className="p-3 bg-red-600 hover:bg-red-700 rounded-md font-semibold">
                        Find Me
                    </button>
                </div>
            </div>
          </div>
          
          {/* Footer with Audio Controls */}
          <div className="p-6 border-t border-gray-700 flex-shrink-0 space-y-6">
              {/* Player Volume Control */}
              <div className="space-y-2">
                  <label htmlFor="player-volume-slider" className="text-lg font-semibold text-gray-300">Player Volume</label>
                  <input 
                      id="player-volume-slider"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={playerVolume}
                      onChange={handlePlayerVolumeChange}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
              </div>
          
              {/* Music Controls */}
              <div className="border-t border-gray-700 pt-6 space-y-4">
                  <label htmlFor="music-toggle" className="flex items-center justify-between cursor-pointer">
                      <span className="text-lg font-semibold text-gray-300">Music</span>
                      <div className="relative">
                          <input 
                            type="checkbox" 
                            id="music-toggle" 
                            className="sr-only peer"
                            checked={isMusicPlaying}
                            onChange={() => setIsMusicPlaying(prev => !prev)}
                          />
                          <div className="block bg-gray-700 w-14 h-8 rounded-full peer-checked:bg-red-600 transition"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition peer-checked:translate-x-full"></div>
                      </div>
                  </label>
                  {isMusicPlaying && (
                    <div className="space-y-2">
                        <label htmlFor="music-volume-slider" className="text-lg font-semibold text-gray-300">Music Volume</label>
                        <input 
                            id="music-volume-slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={musicVolume}
                            onChange={handleMusicVolumeChange}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                        />
                    </div>
                  )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};