
import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="bg-white/10 dark:bg-black/20 backdrop-blur-sm p-2 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-black text-red-600 tracking-tighter">
          TEEVO
        </h1>
        <span className="ml-2 text-xs font-semibold text-red-500 border border-red-500 px-1.5 py-0.5 rounded-sm">LIVE</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholder for language selector */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.874 6 7.5 6h5c.626 0 .988-.27 1.256-.577a6.012 6.012 0 011.912 2.706C15.988 8.27 15.626 8.5 15 8.5h-1.618a1 1 0 00-.951.691l-.296.74c-.263.658-.878 1.069-1.635 1.069h-1.01a1.635 1.635 0 00-1.635-1.069l-.296-.74a1 1 0 00-.951-.691H5c-.626 0-.988.23-1.256.473a6.003 6.003 0 01-.412-.446z" clipRule="evenodd" /></svg>
          <span>EN</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </div>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
