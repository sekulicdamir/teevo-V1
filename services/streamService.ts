
import type { Location, Stream } from '../types';
import { STREAMS } from '../constants';

// This service is now simplified. Geolocation is no longer used to select a primary stream.
// It just returns the master list of streams.
export const getStreams = (location: Location | null): Stream[] => {
  console.log('Fetching master stream list. Location data no longer influences stream selection.');
  return STREAMS;
};