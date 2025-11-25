export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Unknown';

export interface IngredientInfo {
  name: string;
  risk: RiskLevel;
  description: string;
  sources?: string;
}

export interface IngredientReport extends IngredientInfo {
  originalTerm: string;
}

export interface AnalysisResult {
  transparencyScore: number;
  ingredientReports: IngredientReport[];
  riskSummary: {
    [key in RiskLevel]: number;
  };
  rawIngredients: string;
  normalizedIngredients: string;
}

export type AppState = {
  result?: AnalysisResult;
  error?: string;
  message?: string;
};
