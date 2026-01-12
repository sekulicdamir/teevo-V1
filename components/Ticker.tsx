
import React from 'react';
import type { Stock } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from './Icons';

interface TickerProps {
  stocks: Stock[];
}

export const Ticker: React.FC<TickerProps> = ({ stocks }) => {
  if (stocks.length === 0) return null;

  const TickerItem: React.FC<{stock: Stock}> = ({ stock }) => (
    <div className="flex items-center mx-4 py-2">
      <span className="font-bold text-gray-400 text-sm">{stock.symbol}</span>
      <span className="ml-2 font-semibold text-white text-lg">{stock.price.toFixed(2)}</span>
      <div className="w-4 h-4 mx-1">
        {stock.change >= 0 ? 
          <ArrowUpIcon className="text-green-500" /> :
          <ArrowDownIcon className="text-red-500" />
        }
      </div>
      <span className={`font-semibold text-lg ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {Math.abs(stock.change).toFixed(2)}
      </span>
    </div>
  );

  const tickerContent = stocks.map(stock => <TickerItem key={stock.id} stock={stock} />);

  return (
    <div className="bg-gray-900 text-white w-full overflow-hidden flex whitespace-nowrap border-t-2 border-gray-700 font-sans h-12">
        <div className="flex-grow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-max h-full flex items-center animate-scroll-long">
                <div className="flex">{tickerContent}</div>
                {/* Duplicate for seamless scroll */}
                <div className="flex">{tickerContent}</div>
            </div>
        </div>
    </div>
  );
};
