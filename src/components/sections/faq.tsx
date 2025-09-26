
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslation } from '@/hooks/use-translation';

export function FaqSection() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('faq.items.0.question'),
      answer: t('faq.items.0.answer'),
    },
    {
      question: t('faq.items.1.question'),
      answer: t('faq.items.1.answer'),
    },
    {
      question: t('faq.items.2.question'),
      answer: t('faq.items.2.answer'),
    },
    {
      question: t('faq.items.3.question'),
      answer: t('faq.items.3.answer'),
    },
  ];

  return (
    <section id="faq" className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            {t('faq.title')}
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t('faq.description')}
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
