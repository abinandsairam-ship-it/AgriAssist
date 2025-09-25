import { FarmingNews } from '@/components/dashboard/farming-news';

export default function NewsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Farming News</h1>
        <p className="text-muted-foreground">
          Stay up to date with the latest in agriculture.
        </p>
      </header>
      <FarmingNews />
    </div>
  );
}
