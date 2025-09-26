
'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

export function ProductsSection() {
  const { t } = useTranslation();

  const products = [
    {
      id: 'product-drone',
      title: t('products.items.0.title'),
      description: t('products.items.0.description'),
    },
    {
      id: 'product-soil-sense',
      title: t('products.items.1.title'),
      description: t('products.items.1.description'),
    },
    {
      id: 'product-mobile-app',
      title: t('products.items.2.title'),
      description: t('products.items.2.description'),
    },
  ];

  return (
    <section id="products" className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            {t('products.title')}
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t('products.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const image = PlaceHolderImages.find(img => img.id === product.id);
            return (
              <Card key={product.id}>
                <CardHeader>
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        data-ai-hint={image.imageHint}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle>{product.title}</CardTitle>
                  <p className="text-muted-foreground">{product.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
