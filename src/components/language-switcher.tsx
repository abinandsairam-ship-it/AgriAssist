"use client";
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANGUAGES } from '@/lib/constants';
import { Languages } from 'lucide-react';

type LanguageSwitcherProps = {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
};

export function LanguageSwitcher({
  selectedLanguage,
  onLanguageChange,
}: LanguageSwitcherProps) {
  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-auto h-10 border-0 gap-2 focus:ring-0 bg-transparent">
        <Languages className="h-5 w-5 text-muted-foreground" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map(lang => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
