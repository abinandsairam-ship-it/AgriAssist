"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Wrench } from 'lucide-react';

const tools = [
  {
    id: 1,
    name: "Smart Tractor",
    price: 75000,
    imageUrl: "https://picsum.photos/seed/smart-tractor/400/300",
    description: "GPS-enabled autonomous tractor for large fields."
  },
  {
    id: 2,
    name: "Precision Seeder",
    price: 5200,
    imageUrl: "https://picsum.photos/seed/seeder/400/300",
    description: "Ensures optimal seed placement and depth."
  },
  {
    id: 3,
    name: "Harvesting Drone",
    price: 12000,
    imageUrl: "https://picsum.photos/seed/harvest-drone/400/300",
    description: "Automated fruit and vegetable picking."
  }
];

export function FarmingToolsMarketplace() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Wrench className="h-6 w-6 text-primary" />
        <CardTitle>Farming Tools Marketplace</CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <Card key={tool.id} className="overflow-hidden">
            <div className="relative aspect-4/3">
              <Image src={tool.imageUrl} alt={tool.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{tool.name}</h3>
              <p className="text-sm text-muted-foreground h-10">{tool.description}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold">${tool.price.toLocaleString()}</p>
                <Button size="sm"><ShoppingCart className="mr-2 h-4 w-4" />Buy Now</Button>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
