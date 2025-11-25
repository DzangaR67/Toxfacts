'use server';

import { z } from 'zod';
import { normalizeIngredientList } from '@/ai/flows/normalize-ingredient-list';
import { scrapeIngredients } from '@/ai/flows/scrape-ingredients';
import type { AppState, AnalysisResult, IngredientReport, RiskLevel } from '@/lib/definitions';
import { findIngredient, vagueTerms } from '@/lib/toxicology-db';

const formSchema = z.object({
  inputType: z.enum(['url', 'text']),
  inputValue: z.string().min(1, 'Please enter a URL or ingredient list.'),
});

export async function handleAnalysis(
  prevState: AppState,
  formData: FormData
): Promise<AppState> {
  const validatedFields = formSchema.safeParse({
    inputType: formData.get('inputType'),
    inputValue: formData.get('inputValue'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.inputValue?.[0] || 'Invalid input.',
    };
  }

  const { inputType, inputValue } = validatedFields.data;
  let rawIngredientList = '';

  if (inputType === 'url') {
    try {
      const result = await scrapeIngredients({ url: inputValue });
      if (result.ingredientList && result.ingredientList.length > 0) {
        rawIngredientList = result.ingredientList;
      } else {
        return { error: 'Sorry, we could not find an ingredient list at this URL. The page might not contain one, or it might require JavaScript to display.' };
      }
    } catch (e: any) {
      console.error(e);
      return { error: `Failed to process the page. The website might be using anti-scraping technology or require JavaScript. Error detail: ${e.message}` };
    }
  } else {
    rawIngredientList = inputValue;
  }
  
  try {
    const { normalizedIngredientList } = await normalizeIngredientList({ ingredientList: rawIngredientList });

    const ingredients = normalizedIngredientList.split(',').filter(i => i.trim().length > 0);
    let score = 100;

    const riskSummary: AnalysisResult['riskSummary'] = { High: 0, Moderate: 0, Low: 0, Unknown: 0 };
    
    const ingredientReports = ingredients.map(originalTerm => {
      const info = findIngredient(originalTerm);
      
      const termLower = originalTerm.trim().toLowerCase();
      if (vagueTerms.includes(termLower)) {
        score -= 15;
      }
      if (info.risk === 'Unknown') {
        score -= 5;
      }

      riskSummary[info.risk]++;
      
      return {
        originalTerm: originalTerm.trim(),
        ...info,
      };
    });

    const finalScore = Math.max(0, score);

    return {
      result: {
        transparencyScore: finalScore,
        ingredientReports,
        riskSummary,
        rawIngredients: rawIngredientList,
        normalizedIngredients: normalizedIngredientList,
      },
    };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred during AI-powered normalization. Please try again.' };
  }
}
