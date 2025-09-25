import {
  BrainCircuit,
  HeartPulse,
  Leaf,
  CloudSun,
  Languages,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const services = [
  {
    icon: BrainCircuit,
    title: 'AI Crop Detection',
    description: 'Instantly identify crop types from images with high accuracy.',
  },
  {
    icon: HeartPulse,
    title: 'Crop Condition Analysis',
    description: 'Diagnose diseases, pest attacks, and nutrient deficiencies.',
  },
  {
    icon: Leaf,
    title: 'Crop Recommendation',
    description: 'Get expert advice on improving crop health and yield.',
  },
  {
    icon: CloudSun,
    title: 'Weather & Location',
    description: 'Context-aware analysis using local weather and soil data.',
  },
  {
    icon: Languages,
    title: 'Multi-language Support',
    description: 'Accessible to farmers across different regions and languages.',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="w-full py-16 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Our Services
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            A suite of powerful tools designed for the modern farmer, providing
            actionable insights to improve agricultural outcomes.
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
