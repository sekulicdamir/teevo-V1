
import type { NewsArticle, Location } from '../types';
import { NEWS_HEADLINES } from '../constants';
import { translateNews } from './translationService';

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
 * Fetches live local news headlines by parsing a specified RSS feed.
 * @param location The user's location (currently unused but kept for API consistency).
 * @returns A promise that resolves to an array of NewsArticle objects.
 */
export const getLiveNewsHeadlines = async (location: Location | null): Promise<NewsArticle[]> => {
    const rssUrl = 'https://balkaninsight.com/category/bi/montenegro/feed';
    console.log(`Using static RSS Feed: ${rssUrl}`);
    
    try {
        // Fetch the RSS feed using a CORS proxy with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`;
        const feedResponse = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!feedResponse.ok) {
            throw new Error(`Failed to fetch RSS feed with status: ${feedResponse.status}`);
        }
        const xmlText = await feedResponse.text();

        // Parse the XML feed
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            console.error('XML Parsing Error:', parserError.textContent);
            throw new Error('Failed to parse the news feed XML.');
        }
        
        let items = xmlDoc.querySelectorAll('item'); // For RSS
        if (items.length === 0) {
            items = xmlDoc.querySelectorAll('entry'); // For Atom
        }

        if (items.length === 0) {
            throw new Error('No <item> or <entry> tags found in the news feed.');
        }

        const articles: NewsArticle[] = Array.from(items).slice(0, 10).map((item, index) => {
            const title = item.querySelector('title')?.textContent || 'No Title';
            
            const description = item.querySelector('description')?.textContent 
                              || item.querySelector('summary')?.textContent 
                              || item.querySelector('content')?.textContent 
                              || '';
            
            let link = item.querySelector('link')?.textContent;
            if (!link) {
                const linkNode = item.querySelector('link');
                if(linkNode && linkNode.hasAttribute('href')) {
                    link = linkNode.getAttribute('href');
                }
            }
            link = link || '#';
            
            let sourceHost = 'Unknown Source';
            try {
                if (link && link.startsWith('http')) {
                    sourceHost = new URL(link).hostname;
                }
            } catch (e) {
                console.warn(`Could not parse link URL: ${link}`);
            }

            return {
                id: `live-${index}`,
                headline: title,
                subHeadline: stripHtmlAndTruncate(description),
                source: sourceHost,
            };
        });
        
        if (articles.length === 0) {
             throw new Error('Could not extract any articles from the feed.');
        }

        if (location?.country) {
            console.log(`Translating news for country code: ${location.country}`);
            return await translateNews(articles, location.country);
        }

        return articles;

    } catch (error) {
        console.error("Failed to fetch live news, falling back to static headlines.", error);
        return NEWS_HEADLINES;
    }
};