import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is Agriassist?',
    answer:
      'Agriassist is a web application that uses AI to help farmers detect crop types, identify diseases, and monitor crop health from images. It provides instant analysis and recommendations to improve farming outcomes.',
  },
  {
    question: 'How does the crop detection work?',
    answer:
      'Our platform uses advanced machine learning models trained on vast datasets of crop images. When you upload a picture, the AI analyzes visual patterns to identify the crop and detect signs of diseases or nutrient deficiencies.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, data security is our top priority. All data transmissions are encrypted, and we use secure cloud infrastructure to store your images and prediction results. We adhere to strict privacy policies to protect your information.',
  },
  {
    question: 'What kind of support do you offer?',
    answer:
      'We offer comprehensive support through email and phone. Our team is ready to assist you with any technical issues or questions you may have about using the platform and interpreting the results.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Find answers to common questions about Agriassist.
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
