import type { IngredientInfo, RiskLevel } from '@/lib/definitions';
import toxicDb from './toxicology-db.json';
import lowRiskDb from './low-risk-ingredients.json';

interface DbIngredient {
    name?: string;
    ingredient_name?: string;
    risk?: RiskLevel;
    risk_level?: RiskLevel | string;
    safety_profile?: RiskLevel | string;
    description?: string;
    health_concerns?: string[] | string;
    [key: string]: any;
}

const typedToxicDb: {
    toxic_ingredients: DbIngredient[];
    synonyms: Record<string, string[]>;
} = toxicDb as any;

const typedLowRiskDb: {
    ingredients: DbIngredient[];
} = lowRiskDb as any;


const synonymMap = new Map<string, string>();
for (const main in typedToxicDb.synonyms) {
    const upperMain = main.toUpperCase();
    synonymMap.set(upperMain, upperMain);
    for (const synonym of typedToxicDb.synonyms[main]) {
        synonymMap.set(synonym.toUpperCase(), upperMain);
    }
}

const ingredientMap = new Map<string, DbIngredient>();
// Load toxic ingredients first, so they take precedence
typedToxicDb.toxic_ingredients.forEach(item => {
    const name = item.name || item.ingredient_name;
    if (name) {
        ingredientMap.set(name.toUpperCase(), item);
    }
});

// Load low-risk ingredients, but don't overwrite existing high-risk ones
typedLowRiskDb.ingredients.forEach(item => {
    const name = item.name || item.ingredient_name;
    if (name) {
        const upperName = name.toUpperCase();
        if (!ingredientMap.has(upperName)) {
            ingredientMap.set(upperName, item);
        }
    }
});


const unknownIngredient: IngredientInfo = {
  name: 'Unknown Ingredient',
  risk: 'Unknown',
  description: 'This ingredient was not found in our database. This could be due to a misspelling, a new or rare ingredient, or a non-standard name. Its safety profile is undetermined.',
};

export const vagueTerms = ['fragrance', 'parfum', 'preservative', 'colorant', 'aroma'];

function normalizeRisk(risk: RiskLevel | string | undefined): RiskLevel {
    const riskStr = String(risk || 'Unknown').toLowerCase();
    if (riskStr.includes('high')) return 'High';
    if (riskStr.includes('moderate')) return 'Moderate';
    if (riskStr.includes('low') || riskStr.includes('safe')) return 'Low';
    return 'Unknown';
}

function getDescription(item: DbIngredient): string {
    if (item.description) return item.description;
    if(typeof item.health_concerns === 'string') return item.health_concerns;
    if(Array.isArray(item.health_concerns)) return item.health_concerns.join(', ');
    return 'No description available.';
}

export function findIngredient(name: string): IngredientInfo {
  const cleanedName = name.trim().toUpperCase();
  const mainName = synonymMap.get(cleanedName) || cleanedName;

  const found = ingredientMap.get(mainName);

  if (found) {
    const risk = normalizeRisk(found.risk || found.risk_level || found.safety_profile);
    const description = getDescription(found);
    
    return {
      name: found.name || found.ingredient_name || name,
      risk: risk,
      description: description,
      sources: 'ToxFacts Database'
    };
  }
  
  return { ...unknownIngredient, name: name.trim() };
}
