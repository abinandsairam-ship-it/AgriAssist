"use client";

import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { HistoryItem } from '@/lib/definitions';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

type HistoryListProps = {
  history: HistoryItem[];
};

export function HistoryList({ history }: HistoryListProps) {
  const getBadgeVariant = (
    condition: string
  ): 'destructive' | 'default' => {
    return condition.toLowerCase() === 'healthy' ? 'default' : 'destructive';
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Crop Type</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map(item => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="w-16 h-12 relative rounded-md overflow-hidden border">
                  <Image
                    src={item.imageUrl}
                    alt={`Prediction for ${item.cropType}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{item.cropType}</TableCell>
              <TableCell>
                <Badge
                  variant={getBadgeVariant(item.condition)}
                  className="gap-1 items-center"
                >
                  {item.condition.toLowerCase() === 'healthy' ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {item.condition}
                </Badge>
              </TableCell>
              <TableCell>{Math.round(item.confidence * 100)}%</TableCell>
              <TableCell className="text-right">
                {new Date(item.timestamp).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
