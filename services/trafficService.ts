
import type { TrafficCamera } from '../types';
import { TRAFFIC_CAMERAS } from '../constants';

// This is a mock service. A real app would fetch this from a traffic API.
export const getTrafficCameras = (): TrafficCamera[] => {
  return TRAFFIC_CAMERAS;
};
