
"use client";

import Link from 'next/link';
import * as React from 'react';
import { Leaf, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#products', label: 'Products' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#contact', label: 'Contact Us' },
];

function DummyLanguageSwitcher() {
  const [lang, setLang] = React.useState('en');
  return <LanguageSwitcher selectedLanguage={lang} onLanguageChange={setLang} />;
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-auto flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">Agriassist</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.slice(1).map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 ml-6">
          <DummyLanguageSwitcher />
          <ThemeToggle />
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>

        <div className="md:hidden flex items-center ml-2">
          <DummyLanguageSwitcher />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col h-full">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map(link => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="block px-2 py-1 text-lg hover:bg-accent rounded-md"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto p-4">
                   <Button asChild className="w-full">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
