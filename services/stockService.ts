
import type { Stock } from '../types';
import { STOCKS } from '../constants';

// This is a mock service. A real app would fetch this from a financial API.
export const getStocks = (): Stock[] => {
  return STOCKS;
};
