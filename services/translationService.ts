
import { GoogleGenAI, Type } from "@google/genai";
import type { NewsArticle } from '../types';

// Do not instantiate the AI client here if the API key is not yet available.
// It will be created on-demand in the translateNews function.

/**
 * Translates news articles to the primary language of a given country.
 * @param articles The array of NewsArticle objects to translate.
 * @param countryCode The two-letter ISO country code (e.g., 'ME' for Montenegro).
 * @returns A promise that resolves to an array of translated NewsArticle objects.
 *          If translation fails, it returns the original articles.
 */
export const translateNews = async (
  articles: NewsArticle[],
  countryCode: string
): Promise<NewsArticle[]> => {
  if (!process.env.API_KEY) {
    console.warn('Gemini API key not found. Skipping translation.');
    return articles;
  }
  if (!articles || articles.length === 0) {
    return articles;
  }

  // It's best practice to create the GenAI instance right before the API call
  // to ensure it uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Get the full country name for a more robust prompt.
  const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) || countryCode;

  const prompt = `Translate the 'headline' and 'subHeadline' values in the following JSON array of news articles into the primary official language of ${countryName} (${countryCode}). Maintain the exact original JSON structure, including all original property names and 'id' values. Only modify the text content of 'headline' and 'subHeadline'.`;
  
  const articlesToTranslate = articles.map(({ id, headline, subHeadline, source }) => ({
    id,
    headline,
    subHeadline: subHeadline || '', // Ensure subHeadline is always a string
    source
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'user', parts: [{ text: JSON.stringify(articlesToTranslate, null, 2) }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              headline: { type: Type.STRING },
              subHeadline: { type: Type.STRING },
              source: { type: Type.STRING },
            },
            required: ["id", "headline", "subHeadline", "source"],
          },
        },
      },
    });

    const translatedText = response.text;
    if (!translatedText) {
        throw new Error("Translation response was empty.");
    }

    const translatedArticles = JSON.parse(translatedText);

    // Basic validation to ensure we got a valid array back
    if (!Array.isArray(translatedArticles) || translatedArticles.length !== articles.length) {
        throw new Error("Translated data structure does not match original.");
    }
    
    // Merge back the original source, as it shouldn't be translated
    return translatedArticles.map((translated, index) => ({
        ...translated,
        source: articles[index].source,
    }));

  } catch (error) {
    console.error("Failed to translate news headlines:", error);
    // Fallback to original articles if translation fails
    return articles;
  }
};