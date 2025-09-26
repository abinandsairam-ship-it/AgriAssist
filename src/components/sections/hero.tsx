
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { useUser } from '@/firebase';


export function HeroSection() {
  const { t } = useTranslation();
  const { user } = useUser();


  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {t('hero.description')}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={user ? "/dashboard" : "/sign-in"}>{t('hero.cta')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
