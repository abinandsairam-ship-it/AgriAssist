
'use client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BellRing, CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function CalendarPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">
          Calendar & Reminders
        </h1>
        <p className="text-muted-foreground">
          Manage your farm schedule and set important reminders.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
             <CardHeader className="flex flex-row items-center gap-4">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <CardTitle>Your Farming Calendar</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex justify-center">
                <Calendar
                mode="single"
                className="p-4"
                />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader  className="flex flex-row items-center gap-4">
                <BellRing className="h-6 w-6 text-primary" />
                <CardTitle>Set a Reminder</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reminder-title">Title</Label>
                  <Input id="reminder-title" placeholder="e.g., Apply Pesticides" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reminder-date">Date</Label>
                  <Input id="reminder-date" type="date" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="reminder-notes">Notes</Label>
                  <Textarea id="reminder-notes" placeholder="e.g., Use nitrogen-rich variant" />
                </div>
                <Button className="w-full">Set Reminder</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
