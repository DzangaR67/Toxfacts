import { ToxFactsClient } from '@/components/tox-facts-client';
import { Logo } from '@/components/icons';

export default function Home() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Logo className="w-10 h-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-headline tracking-tight text-gray-800 dark:text-gray-200">
            ToxFacts
          </h1>
        </div>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Uncover the truth behind your beauty products. Analyze ingredients for potential health risks and check label transparency in seconds.
        </p>
      </header>
      <ToxFactsClient />
    </main>
  );
}
