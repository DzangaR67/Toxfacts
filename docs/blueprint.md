# **App Name**: ToxFacts

## Core Features:

- URL or Ingredient Input: Accepts product URLs or manual ingredient lists for analysis.
- Automated Ingredient Extraction: Web scraper retrieves ingredient lists from product pages (Clicks, Dis-Chem, Takealot).
- Ingredient Normalization via NLP: Cleans and formats raw ingredient lists for accurate toxicity matching. The NLP Tool will use reasoning to decide if special chemical symbols such as PEG-136 and C14-22 should be cleaned.
- Toxicity Analysis and Classification: Cross-references ingredients with a toxicology database to classify risk levels (Low, Moderate, High).
- Label Transparency Score: Calculates a score (0-100%) based on the clarity and completeness of the ingredient list.
- Data Caching: Saves analyzed products to a JSON cache for quick retrieval and to build a local cosmetic ingredient dataset.
- Visual Toxicity Report: Presents a clear visual report of ingredient risks and Label Transparency score, enhancing public knowledge and awareness.

## Style Guidelines:

- Primary color: Soft lavender (#E6E6FA) to evoke cleanliness and purity.
- Background color: Light gray (#F5F5F5), very lightly tinted with lavender.
- Accent color: Pale blue (#ADD8E6) for interactive elements and highlights.
- Body text: 'PT Sans' (sans-serif) for readability.
- Headline text: 'Belleza' (sans-serif) for an art and design look.
- Use simple, clear icons to represent risk levels and ingredient categories.
- Design a clean, intuitive dashboard layout with clear sections for input, analysis, and results.
- Use subtle animations for loading and report generation to enhance user experience.