
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bug } from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function IssueReporterPage() {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [complaint, setComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      toast({
        title: 'Complaint Submitted',
        description: 'Thank you for your feedback. Our team will look into it shortly.',
      });
      setSubject('');
      setComplaint('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Issue Reporter</h1>
        <p className="text-muted-foreground">
          Report any issues or provide feedback.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><Bug className='h-6 w-6'/>File a Complaint</CardTitle>
            <CardDescription>
              We value your feedback. Please describe the issue you are facing.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Unable to upload image"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complaint">Complaint Details</Label>
                <Textarea
                  id="complaint"
                  placeholder="Please provide a detailed description of the issue."
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  required
                  rows={6}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
