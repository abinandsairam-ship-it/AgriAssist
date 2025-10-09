
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
import { Loader2, History, Lock, FileClock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { HistoryItem } from '@/lib/definitions';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';

function HistoryList({ history }: { history: HistoryItem[] }) {
  const getBadgeVariant = (condition: string) => {
    return condition.toLowerCase() === 'healthy' ? 'default' : 'destructive';
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Your Prediction History</CardTitle>
            <CardDescription>A log of all your past crop analyses.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Crop</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead className="text-right">When</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {history.map(item => (
                        <TableRow key={item.id}>
                        <TableCell>
                            <Image src={item.imageUrl} alt={item.cropType} width={80} height={60} className="rounded-md object-cover" />
                        </TableCell>
                        <TableCell className="font-medium">{item.cropType}</TableCell>
                        <TableCell>
                            <Badge variant={getBadgeVariant(item.condition)}>
                                {item.condition}
                            </Badge>
                        </TableCell>
                         <TableCell>
                            <div className="flex items-center gap-2">
                                <Progress value={item.confidence * 100} className="w-24 h-2" />
                                <span className="text-muted-foreground text-xs">{Math.round(item.confidence * 100)}%</span>
                            </div>
                        </TableCell>
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

export default function HistoryPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const historyQuery = useMemoFirebase(() => {
    if (isUserLoading || !user?.uid) {
      return null;
    }
    return query(
      collection(firestore, 'crop_data'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
  }, [firestore, user, isUserLoading]);

  const { data: history, isLoading: isHistoryLoading, error } =
    useCollection<HistoryItem>(historyQuery);

  const isLoading = isUserLoading || (user && isHistoryLoading);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <History className="h-8 w-8" />
          Prediction History
        </h1>
        <p className="text-muted-foreground">
          Review your past crop analysis results.
        </p>
      </header>
      
      {isLoading ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <CardTitle className="mt-4">Loading History...</CardTitle>
            <CardDescription>Fetching your analysis log from the cloud.</CardDescription>
        </Card>
      ) : !user ? (
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
      ) : error ? (
         <Card className="mt-8">
            <CardContent className="p-12 flex flex-col items-center text-center">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <h2 className="text-2xl font-semibold">An Error Occurred</h2>
                <p className="text-muted-foreground mt-2">
                    Could not load your prediction history. Please try again later.
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
            <h2 className="text-2xl font-semibold">No Predictions Found</h2>
            <p className="text-muted-foreground mt-2">
              Analyze a crop in the Crop Detection page to see your history here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
