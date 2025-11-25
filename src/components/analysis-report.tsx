import type { AnalysisResult, IngredientReport, RiskLevel } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { TransparencyGauge } from './transparency-gauge';
import { RiskSummary } from './risk-summary';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { cn } from '@/lib/utils';

const riskIconMap: Record<RiskLevel, React.ReactNode> = {
  Low: <CheckCircle className="h-5 w-5 text-green-600" />,
  Moderate: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
  High: <ShieldAlert className="h-5 w-5 text-red-600" />,
  Unknown: <ShieldQuestion className="h-5 w-5 text-gray-500" />,
};

const riskColorMap: Record<RiskLevel, string> = {
    Low: "border-l-4 border-green-600",
    Moderate: "border-l-4 border-yellow-600",
    High: "border-l-4 border-red-600",
    Unknown: "border-l-4 border-gray-500",
};

function Ingredient({ item }: { item: IngredientReport }) {
  return (
    <AccordionItem value={item.originalTerm} className={cn("px-4 rounded-md", riskColorMap[item.risk])}>
      <AccordionTrigger>
        <div className="flex items-center gap-4">
          {riskIconMap[item.risk]}
          <span className="text-left font-medium">{item.originalTerm}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{item.description}</p>
        {item.sources && (
          <p className="text-xs">
            <strong>Sources:</strong> {item.sources}
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export function AnalysisReport({ result }: { result: AnalysisResult }) {
  return (
    <Card className="mt-8 animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">Analysis Report</CardTitle>
        <CardDescription>
          Here's the breakdown of the ingredients and the product's label transparency.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-2">Label Transparency Score</h3>
            <TransparencyGauge score={result.transparencyScore} />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center md:text-left">Ingredient Risk Summary</h3>
            <RiskSummary summary={result.riskSummary} />
          </div>
        </div>

        <Separator />
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Understanding Risk Levels</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside text-sm">
              <li><strong className="text-green-600">Low Risk:</strong> Considered safe for general use.</li>
              <li><strong className="text-yellow-600">Moderate Risk:</strong> May cause irritation or have concerns for some individuals. Use with awareness.</li>
              <li><strong className="text-red-600">High Risk:</strong> Backed by scientific evidence suggesting potential health hazards.</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div>
          <h3 className="text-lg font-semibold mb-2">Detailed Ingredient List</h3>
          <Accordion type="multiple" className="w-full space-y-2">
            {result.ingredientReports.map((item) => (
              <Ingredient key={item.originalTerm} item={item} />
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
