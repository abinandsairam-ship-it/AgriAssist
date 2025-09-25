"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: "Revolutionary New Irrigation System Saves 50% Water",
    source: "AgriTech Today",
    date: "2024-07-28",
    imageUrl: "https://picsum.photos/seed/irrigation-news/400/225",
    url: "#"
  },
  {
    id: 2,
    title: "Organic Farming Market to Double by 2030, Report Says",
    source: "Future Farms",
    date: "2024-07-27",
    imageUrl: "https://picsum.photos/seed/organic-farm/400/225",
    url: "#"
  },
  {
    id: 3,
    title: "AI Predicts Crop Yields with 95% Accuracy",
    source: "AI in Ag",
    date: "2024-07-26",
    imageUrl: "https://picsum.photos/seed/ai-yield/400/225",
    url: "#"
  }
];

export function FarmingNews() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Newspaper className="h-6 w-6 text-primary" />
        <CardTitle>Farming News</CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsItems.map(item => (
          <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="group">
            <div className="relative aspect-video rounded-lg overflow-hidden border">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition-transform group-hover:scale-105" />
            </div>
            <h3 className="mt-2 text-md font-semibold group-hover:text-primary">{item.title}</h3>
            <p className="text-xs text-muted-foreground">{item.source} - {item.date}</p>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
