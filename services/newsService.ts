
import type { NewsArticle } from '../types';
import { NEWS_HEADLINES } from '../constants';

// This is a mock service. A real app would fetch this from a news API.
export const getNewsHeadlines = (): NewsArticle[] => {
  return NEWS_HEADLINES;
};
