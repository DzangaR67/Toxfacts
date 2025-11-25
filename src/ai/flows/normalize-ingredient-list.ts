'use server';

/**
 * @fileOverview Normalizes an ingredient list using NLP, preserving chemical symbols.
 *
 * - normalizeIngredientList - A function that normalizes a list of ingredients.
 * - NormalizeIngredientListInput - The input type for the normalizeIngredientList function.
 * - NormalizeIngredientListOutput - The return type for the normalizeIngredientList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NormalizeIngredientListInputSchema = z.object({
  ingredientList: z
    .string()
    .describe('The raw ingredient list to be normalized.'),
});
export type NormalizeIngredientListInput = z.infer<
  typeof NormalizeIngredientListInputSchema
>;

const NormalizeIngredientListOutputSchema = z.object({
  normalizedIngredientList: z
    .string()
    .describe('The normalized ingredient list.'),
});
export type NormalizeIngredientListOutput = z.infer<
  typeof NormalizeIngredientListOutputSchema
>;

export async function normalizeIngredientList(
  input: NormalizeIngredientListInput
): Promise<NormalizeIngredientListOutput> {
  return normalizeIngredientListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'normalizeIngredientListPrompt',
  input: {schema: NormalizeIngredientListInputSchema},
  output: {schema: NormalizeIngredientListOutputSchema},
  prompt: `You are an expert in cosmetic ingredient normalization. Your task is to clean and format a raw ingredient list, removing unnecessary symbols but preserving chemical names such as PEG-136 and C14-22 Alcohols. Return the normalized ingredient list.

Raw Ingredient List: {{{ingredientList}}}`,
});

const normalizeIngredientListFlow = ai.defineFlow(
  {
    name: 'normalizeIngredientListFlow',
    inputSchema: NormalizeIngredientListInputSchema,
    outputSchema: NormalizeIngredientListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
