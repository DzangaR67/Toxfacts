'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleAnalysis } from '@/app/actions';
import type { AppState } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AnalysisReport } from './analysis-report';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AnalysisSkeleton } from './analysis-skeleton';

const initialState: AppState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto" size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Ingredients'
      )}
    </Button>
  );
}

export function ToxFactsClient() {
  const [state, formAction] = useActionState(handleAnalysis, initialState);
  const { pending } = useFormStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg border-primary/20">
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Start Your Analysis</CardTitle>
            <CardDescription>
              Enter a product URL or paste the ingredient list manually.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">Product URL</TabsTrigger>
                <TabsTrigger value="text">Ingredient List</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="mt-4">
                 <input type="hidden" name="inputType" value="url" />
                <div className="space-y-2">
                  <Label htmlFor="url">Product Page Link</Label>
                  <Input
                    id="url"
                    name="inputValue"
                    type="url"
                    placeholder="https://example-store.com/p/product-name"
                    required
                  />
                </div>
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                <input type="hidden" name="inputType" value="text" />
                <div className="space-y-2">
                  <Label htmlFor="text">Ingredient List</Label>
                  <Textarea
                    id="text"
                    name="inputValue"
                    placeholder="e.g. Aqua, Glycerin, Sodium Laureth Sulfate..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {pending && <AnalysisSkeleton />}

      {state?.error && !pending && (
        <Alert variant="destructive" className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      
      {state?.result && !pending && <AnalysisReport result={state.result} />}
    </div>
  );
}
