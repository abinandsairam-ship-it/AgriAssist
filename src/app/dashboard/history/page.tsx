import { getPredictionHistory } from '@/lib/firebase';
import { HistoryList } from '@/components/dashboard/history-list';
import { Card, CardContent } from '@/components/ui/card';
import { FileClock } from 'lucide-react';

export default async function HistoryPage() {
  const history = await getPredictionHistory();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">
          Prediction History
        </h1>
        <p className="text-muted-foreground">
          View your past crop analysis records.
        </p>
      </header>

      {history.length > 0 ? (
        <HistoryList history={history} />
      ) : (
        <Card className="mt-8">
          <CardContent className="p-12 flex flex-col items-center text-center">
            <FileClock className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">No History Found</h2>
            <p className="text-muted-foreground mt-2">
              Make your first prediction to see your history here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
