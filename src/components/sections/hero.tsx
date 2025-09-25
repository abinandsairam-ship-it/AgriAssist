import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
            Agriassist – Advanced Crop Detection and Health Monitoring
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Leveraging AI to provide accurate crop detection, soil analysis, and
            health recommendations for modern farming.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
