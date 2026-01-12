
import { GoogleGenAI } from '@google/genai';
import type { NewsArticle, Location } from '../types';
import { NEWS_HEADLINES } from '../constants';

// This is a mock service. A real app would fetch this from a news API.
export const getNewsHeadlines = (): NewsArticle[] => {
  return NEWS_HEADLINES;
};

/**
 * A utility function to strip HTML tags from a string and truncate it.
 * @param html The HTML string to clean.
 * @param maxLength The maximum length of the returned string.
 * @returns A plain text string.
 */
function stripHtmlAndTruncate(html: string, maxLength: number = 150): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    let text = doc.body.textContent || "";
    if (text.length > maxLength) {
        text = text.substring(0, maxLength) + '...';
    }
    return text;
}

/**
 * Fetches live local news headlines by first finding a relevant RSS feed using Gemini
 * and then parsing that feed.
 * @param location The user's location.
 * @returns A promise that resolves to an array of NewsArticle objects.
 */
export const getLiveNewsHeadlines = async (location: Location | null): Promise<NewsArticle[]> => {
    if (!location || !process.env.API_KEY) {
        console.warn('Location or API Key not available, using static news.');
        return NEWS_HEADLINES;
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // 1. Use Gemini to find a relevant RSS feed URL
        const prompt = `Find a free, public RSS feed URL for local news in ${location.city}, ${location.country}. The language should be appropriate for that country. Return only the single, most relevant URL and nothing else.`;
        const findFeedResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}]
            }
        });
        
        const responseText = findFeedResponse.text?.trim();
        if (!responseText) {
            throw new Error('Gemini did not return a feed URL.');
        }

        // Extract URL from response, as it might contain extra text
        const urlMatch = responseText.match(/(https?:\/\/[^\s]+)/);
        if (!urlMatch || !urlMatch[0]) {
            throw new Error('Could not extract a valid URL from Gemini response.');
        }
        const rssUrl = urlMatch[0];
        console.log(`Found RSS Feed for ${location.city}: ${rssUrl}`);

        // 2. Fetch the RSS feed using a CORS proxy
        // Using allorigins.win as a reliable CORS proxy
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
        const feedResponse = await fetch(proxyUrl);
        if (!feedResponse.ok) {
            throw new Error(`Failed to fetch RSS feed with status: ${feedResponse.status}`);
        }
        const xmlText = await feedResponse.text();

        // 3. Parse the XML feed
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');

        if (items.length === 0) {
            throw new Error('No <item> tags found in the RSS feed.');
        }

        const articles: NewsArticle[] = Array.from(items).slice(0, 10).map((item, index) => {
            const title = item.querySelector('title')?.textContent || 'No Title';
            const description = item.querySelector('description')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '#';
            
            return {
                id: `live-${index}`,
                headline: title,
                subHeadline: stripHtmlAndTruncate(description),
                source: new URL(link).hostname,
            };
        });

        return articles;

    } catch (error) {
        console.error("Failed to fetch live news, falling back to static headlines.", error);
        return NEWS_HEADLINES;
    }
};