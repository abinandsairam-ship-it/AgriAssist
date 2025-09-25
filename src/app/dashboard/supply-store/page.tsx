import { FarmingToolsMarketplace } from '@/components/dashboard/farming-tools-marketplace';

export default function SupplyStorePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
       <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Agri-Supply Store</h1>
        <p className="text-muted-foreground">
          Find all the tools and supplies you need.
        </p>
      </header>
      <FarmingToolsMarketplace />
    </div>
  );
}
