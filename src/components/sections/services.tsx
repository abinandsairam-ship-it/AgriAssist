
'use client';
import {
  BrainCircuit,
  HeartPulse,
  Leaf,
  CloudSun,
  Languages,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

export function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: BrainCircuit,
      title: t('services.items.0.title'),
      description: t('services.items.0.description'),
    },
    {
      icon: HeartPulse,
      title: t('services.items.1.title'),
      description: t('services.items.1.description'),
    },
    {
      icon: Leaf,
      title: t('services.items.2.title'),
      description: t('services.items.2.description'),
    },
    {
      icon: CloudSun,
      title: t('services.items.3.title'),
      description: t('services.items.3.description'),
    },
    {
      icon: Languages,
      title: t('services.items.4.title'),
      description: t('services.items.4.description'),
    },
  ];

  return (
    <section id="services" className="w-full py-16 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            {t('services.title')}
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t('services.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <Card key={service.title}>
              <CardHeader className="flex flex-row items-center gap-4">
                <service.icon className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
