
import type { TravelRoute } from '../types';
import { TRAVEL_TIMES } from '../constants';

// This is a mock service. A real app would fetch this from a traffic/maps API.
export const getTravelTimes = (): TravelRoute[] => {
  return TRAVEL_TIMES;
};
