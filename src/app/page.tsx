import { AppHeader } from '@/components/layout/header';
import { AppFooter } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ServicesSection } from '@/components/sections/services';
import { ProductsSection } from '@/components/sections/products';
import { FaqSection } from '@/components/sections/faq';

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProductsSection />
        <FaqSection />
      </main>
      <AppFooter />
    </>
  );
}
