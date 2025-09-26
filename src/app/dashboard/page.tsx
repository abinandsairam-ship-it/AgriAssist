
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ScanLine,
  Triangle,
  Video,
  Bug,
  History,
  ShoppingCart,
  Store,
  Newspaper,
  Calendar,
  LayoutGrid,
} from 'lucide-react';
import Link from 'next/link';

const dashboardItems = [
  {
    href: '/dashboard/crop-detection',
    icon: ScanLine,
    title: 'Crop Detection',
    description: 'Analyze plant health via camera.',
  },
  {
    href: '/dashboard/crop-suitability',
    icon: Triangle,
    title: 'Crop Suitability',
    description: 'Find the best crops for your soil.',
  },
  {
    href: '/dashboard/agri-videos',
    icon: Video,
    title: 'Agri Videos',
    description: 'Watch farming tutorials and tips.',
  },
  {
    href: '/dashboard/issue-reporter',
    icon: Bug,
    title: 'Issue Reporter',
    description: 'Report issues or give feedback.',
  },
  {
    href: '/dashboard/history',
    icon: History,
    title: 'History',
    description: 'View past analysis records.',
  },
  {
    href: '/dashboard/supply-store',
    icon: ShoppingCart,
    title: 'Agri-Supply Store',
    description: 'Buy farming tools and supplies.',
  },
  {
    href: '/dashboard/farmers-market',
    icon: Store,
    title: 'Farmer\'s Market',
    description: 'Buy fresh crops from local farmers.',
  },
  {
    href: '/dashboard/news',
    icon: Newspaper,
    title: 'Farming News',
    description: 'Stay updated with agri news.',
  },
  {
    href: '/dashboard/calendar',
    icon: Calendar,
    title: 'Calendar',
    description: 'Manage your farm schedule.',
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <LayoutGrid className="h-8 w-8" />
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Quickly access all the features of your AgriAssist dashboard.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dashboardItems.map(item => (
          <Link href={item.href} key={item.title}>
            <Card className="h-full hover:bg-muted/50 hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
