
import type { Location, Stream } from '../types';
import { STREAMS } from '../constants';

// Helper to calculate the squared Euclidean distance. It's faster than true distance
// and sufficient for finding the closest point.
const getDistanceSq = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const dx = lat1 - lat2;
  const dy = lon1 - lon2;
  return dx * dx + dy * dy;
};

// This service now finds the geographically closest news stream to the user.
export const getStreams = (location: Location | null): Stream[] => {
  console.log('Fetching streams for location:', location);
  
  if (!location) {
    // If no location, return the default list with the first stream as primary.
    return STREAMS.map((s, index) => ({ ...s, isPrimary: index === 0 }));
  }

  const { latitude, longitude } = location;
  let closestStream: Stream | null = null;
  let minDistanceSq = Infinity;

  // Find the stream with the minimum distance to the user's location.
  STREAMS.forEach(stream => {
    if (stream.latitude !== undefined && stream.longitude !== undefined) {
      const distanceSq = getDistanceSq(latitude, longitude, stream.latitude, stream.longitude);
      if (distanceSq < minDistanceSq) {
        minDistanceSq = distanceSq;
        closestStream = stream;
      }
    }
  });

  // Return the list of streams with the closest one marked as primary.
  return STREAMS.map(stream => ({
    ...stream,
    isPrimary: closestStream ? stream.id === closestStream.id : false,
  }));
};