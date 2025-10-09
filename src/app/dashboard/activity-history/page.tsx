
'use client';

import React from 'react';
import {
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
} from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Activity, Lock, FileClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { ActivityHistoryItem } from '@/lib/definitions';
import { formatDistanceToNow } from 'date-fns';

function ActivityHistoryList({ history }: { history: ActivityHistoryItem[] }) {
  const getBadgeVariant = (actionType: string) => {
    switch (actionType) {
      case 'login':
        return 'default';
      case 'create_prediction':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map(item => (
            <TableRow key={item.id}>
              <TableCell>
                <Badge variant={getBadgeVariant(item.actionType)}>
                  {item.actionType.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{item.details}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDistanceToNow(new Date(item.timestamp), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ActivityHistoryPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const historyQuery = useMemoFirebase(() => {
    // CRITICAL: Do not create a query until the user state is fully resolved and a UID is available.
    if (isUserLoading || !user?.uid) {
      return null;
    }
    return query(
      collection(firestore, 'history'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
  }, [firestore, user, isUserLoading]);

  const { data: history, isLoading: isHistoryLoading, error } =
    useCollection<ActivityHistoryItem>(historyQuery);

  const isLoading = isUserLoading || (user && isHistoryLoading);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Activity className="h-8 w-8" />
          Activity History
        </h1>
        <p className="text-muted-foreground">
          A log of recent actions performed in your account.
        </p>
      </header>
      
      {isLoading ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <CardTitle className="mt-4">Loading Activity...</CardTitle>
            <CardDescription>Fetching your activity log from the cloud.</CardDescription>
        </Card>
      ) : !user ? (
        <Card className="mt-8">
          <CardContent className="p-12 flex flex-col items-center text-center">
            <Lock className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">Please Sign In</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              You need to be logged in to view your activity history.
            </p>
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center text-destructive">
            <p>An error occurred while loading your activity. Please try again later.</p>
            <p className="text-xs text-muted-foreground mt-2">{error.message}</p>
          </CardContent>
        </Card>
      ) : history && history.length > 0 ? (
        <ActivityHistoryList history={history} />
      ) : (
        <Card className="mt-8">
          <CardContent className="p-12 flex flex-col items-center text-center">
            <FileClock className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">No Activity Found</h2>
            <p className="text-muted-foreground mt-2">
              Perform an action like signing in or making a prediction to see your history here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
