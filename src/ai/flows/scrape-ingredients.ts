'use server';

/**
 * @fileOverview A flow for scraping cosmetic ingredient lists from a given URL.
 * This version uses Genkit's built-in browsing tool to handle dynamic websites.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ScrapeIngredientsInputSchema = z.object({
  url: z.string().url().describe('The URL of the product page.'),
});
export type ScrapeIngredientsInput = z.infer<typeof ScrapeIngredientsInputSchema>;

const ScrapeIngredientsOutputSchema = z.object({
  ingredientList: z.string().optional().describe('The comma-separated list of ingredients found on the page.'),
});
export type ScrapeIngredientsOutput = z.infer<typeof ScrapeIngredientsOutputSchema>;

export async function scrapeIngredients(input: ScrapeIngredientsInput): Promise<ScrapeIngredientsOutput> {
  return scrapeIngredientsFlow(input);
}

const scrapeIngredientsFlow = ai.defineFlow(
  {
    name: 'scrapeIngredientsFlow',
    inputSchema: ScrapeIngredientsInputSchema,
    outputSchema: ScrapeIngredientsOutputSchema,
  },
  async ({ url }) => {
    try {
      const { output } = await ai.generate({
        prompt: `Navigate to the URL ${url}, then extract the cosmetic ingredient list. The list is usually inside a <p>, <div>, or <span> tag and may be preceded by a heading like "Ingredients", "Ingredient List", or "INCI". It might also be in a tab, an accordion, or a similarly structured component. Look for patterns of chemical names, often in ALL CAPS, separated by commas. Extract only the ingredients themselves and return them as a single, clean, comma-separated string. If you cannot find a list, return an empty string.`,
        model: 'googleai/gemini-2.5-flash',
        toolConfig: {
          browsing: {
            js: true, // Enable JavaScript rendering to handle dynamic content
          },
        },
        output: {
          schema: z.object({
            ingredientList: z.string().describe('The comma-separated ingredient list.'),
          }),
        },
      });

      return { ingredientList: output?.ingredientList || '' };

    } catch (error: any) {
      console.error('Error during scraping or AI processing:', error);
      throw new Error(`Failed to process the page. The website might be using anti-scraping technology or the page structure is too complex. Error detail: ${error.message}`);
    }
  }
);
