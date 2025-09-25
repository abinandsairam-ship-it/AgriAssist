'use client';
import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { HistoryList } from '@/components/dashboard/history-list';
import { Card, CardContent } from '@/components/ui/card';
import { FileClock, Loader2 } from 'lucide-react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { HistoryItem } from '@/lib/definitions';

export default function HistoryPage() {
  const firestore = useFirestore();
  const historyQuery = useMemo(
    () =>
      firestore
        ? query(
            collection(firestore, 'crop_data'),
            orderBy('timestamp', 'desc'),
            limit(20)
          )
        : null,
    [firestore]
  );

  const {
    data: history,
    isLoading,
    error,
  } = useCollection<HistoryItem>(historyQuery);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

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

      {error && (
        <Card>
          <CardContent className="p-8 text-center text-destructive">
            <p>Error loading history: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {history && history.length > 0 ? (
        <HistoryList history={history} />
      ) : !isLoading ? (
        <Card className="mt-8">
          <CardContent className="p-12 flex flex-col items-center text-center">
            <FileClock className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">No History Found</h2>
            <p className="text-muted-foreground mt-2">
              Make your first prediction to see your history here.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
