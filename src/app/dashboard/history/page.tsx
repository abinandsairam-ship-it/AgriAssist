
'use client';

import React from 'react';
import {
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
} from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { History, Lock, FileClock, AlertCircle, LogIn, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { ActivityHistoryItem } from '@/lib/definitions';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';


function getActionIcon(actionType: string) {
  switch (actionType) {
    case 'login':
      return <LogIn className="h-4 w-4 text-blue-500" />;
    case 'create_prediction':
      return <FilePlus className="h-4 w-4 text-green-500" />;
    default:
      return <History className="h-4 w-4" />;
  }
}

function HistoryList({ history }: { history: ActivityHistoryItem[] }) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Your Activity History</CardTitle>
            <CardDescription>A log of your recent actions in the app.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className='w-[100px]'>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">When</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {history.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-2 capitalize">
                              {getActionIcon(item.actionType)}
                              {item.actionType.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-muted-foreground">{item.details}</TableCell>
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
      </CardContent>
    </Card>
  );
}

function HistorySkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}


export default function HistoryPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const historyQuery = useMemoFirebase(() => {
    // This is the key fix: DO NOT create a query until the user is loaded and available.
    if (isUserLoading || !user?.uid) {
      return null;
    }
    return query(
      collection(firestore, 'history'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user, isUserLoading]);

  const { data: history, isLoading: isHistoryLoading, error } =
    useCollection<ActivityHistoryItem>(historyQuery);

  const isLoading = isUserLoading || isHistoryLoading;

  if (isUserLoading) {
      return (
          <div className="container mx-auto p-4 md:p-8">
               <header className="mb-8">
                <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                    <History className="h-8 w-8" />
                    Your History
                </h1>
                <p className="text-muted-foreground">
                    Review your past activity.
                </p>
            </header>
            <HistorySkeleton />
          </div>
      )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <History className="h-8 w-8" />
          Your History
        </h1>
        <p className="text-muted-foreground">
          Review your past activity.
        </p>
      </header>
      
      {!user ? (
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
      ) : isLoading ? (
        <HistorySkeleton />
      ) : error ? (
         <Card className="mt-8">
            <CardContent className="p-12 flex flex-col items-center text-center">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <h2 className="text-2xl font-semibold">An Error Occurred</h2>
                <p className="text-muted-foreground mt-2">
                    Could not load your history. Please try again later.
                </p>
                <p className="text-xs text-muted-foreground mt-4">{error.message}</p>
            </CardContent>
        </Card>
      ) : history && history.length > 0 ? (
        <HistoryList history={history} />
      ) : (
        <Card className="mt-8">
          <CardContent className="p-12 flex flex-col items-center text-center">
            <FileClock className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">No Activity Found</h2>
            <p className="text-muted-foreground mt-2">
              Your actions will be recorded here as you use the app.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
