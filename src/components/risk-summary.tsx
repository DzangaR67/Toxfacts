import type { AnalysisResult } from '@/lib/definitions';
import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, ShieldAlert, ShieldQuestion } from 'lucide-react';

interface RiskSummaryProps {
  summary: AnalysisResult['riskSummary'];
}

export function RiskSummary({ summary }: RiskSummaryProps) {
  const summaryItems = [
    { label: 'High Risk', count: summary.High, Icon: ShieldAlert, color: 'text-red-600' },
    { label: 'Moderate Risk', count: summary.Moderate, Icon: AlertTriangle, color: 'text-yellow-600' },
    { label: 'Low Risk', count: summary.Low, Icon: CheckCircle, color: 'text-green-600' },
    { label: 'Unknown', count: summary.Unknown, Icon: ShieldQuestion, color: 'text-gray-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {summaryItems.map(item => (
        <Card key={item.label} className="p-4 flex flex-col items-center justify-center text-center bg-background/50">
          <item.Icon className={`h-8 w-8 mb-2 ${item.color}`} />
          <p className="text-2xl font-bold">{item.count}</p>
          <p className="text-sm text-muted-foreground">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}
