
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Wheat } from 'lucide-react';

const crops = [
  {
    id: 1,
    name: "Organic Tomatoes",
    price: 2.50,
    unit: "per lb",
    imageUrl: "https://picsum.photos/seed/tomatoes/400/300",
    seller: "Green Valley Farms"
  },
  {
    id: 2,
    name: "Sweet Corn",
    price: 0.75,
    unit: "per ear",
    imageUrl: "https://picsum.photos/seed/sweet-corn/400/300",
    seller: "Sunshine Acres"
  },
  {
    id: 3,
    name: "Fresh Strawberries",
    price: 4.00,
    unit: "per quart",
    imageUrl: "https://picsum.photos/seed/strawberries/400/300",
    seller: "Berry Best Farms"
  }
];

export function CropMarketplace() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Wheat className="h-6 w-6 text-primary" />
        <CardTitle>Buy Fresh Crops</CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map(crop => (
          <Card key={crop.id} className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image src={crop.imageUrl} alt={crop.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{crop.name}</h3>
              <p className="text-xs text-muted-foreground">from {crop.seller}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold">${crop.price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">{crop.unit}</span></p>
                <Button size="sm"><ShoppingCart className="mr-2 h-4 w-4" />Buy Now</Button>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
