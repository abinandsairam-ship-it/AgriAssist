
'use client';
import {
  useMemoFirebase,
  useCollection,
  useFirestore,
  useUser,
} from '@/firebase';
import { HistoryList } from '@/components/dashboard/history-list';
import { Card, CardContent } from '@/components/ui/card';
import { FileClock, Loader2, Lock } from 'lucide-react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { HistoryItem } from '@/lib/definitions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HistoryPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  // The query is now dependent on the user's ID.
  // It will be `null` if the user is not logged in.
  const historyQuery = useMemoFirebase(
    () =>
      firestore && user
        ? query(
            collection(firestore, 'crop_data'),
            orderBy('timestamp', 'desc'),
            limit(20)
          )
        : null,
    [firestore, user]
  );

  const {
    data: history,
    isLoading: isHistoryLoading,
    error,
  } = useCollection<HistoryItem>(historyQuery);

  const isLoading = isUserLoading || isHistoryLoading;

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is not logged in after the loading state is resolved.
  if (!user) {
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
        <Card className="mt-8">
          <CardContent className="p-12 flex flex-col items-center text-center">
            <Lock className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">Please Sign In</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              You need to be logged in to view your prediction history.
            </p>
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center text-destructive">
            <p>Error loading history: {error.message}</p>
          </CardContent>
        </Card>
      ) : history && history.length > 0 ? (
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
