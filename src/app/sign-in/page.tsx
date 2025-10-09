
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useAuth,
  initiateEmailSignIn,
  initiateEmailSignUp,
  initiateAnonymousSignIn,
  useUser,
  useFirestore,
  addDocumentNonBlocking,
} from '@/firebase';
import { Leaf, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { collection } from 'firebase/firestore';

export default function SignInPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const logHistoryEvent = (uid: string, type: 'email' | 'anonymous' | 'signup') => {
      if (!firestore) return;
      const historyCollection = collection(firestore, 'history');
      let details = 'User signed in.';
      if (type === 'anonymous') details = 'User signed in as guest.';
      if (type === 'signup') details = 'New user signed up.';

      addDocumentNonBlocking(historyCollection, {
        userId: uid,
        actionType: 'login',
        timestamp: Date.now(),
        details: details,
      });
  }

  useEffect(() => {
    if (!isUserLoading && user) {
      logHistoryEvent(user.uid, user.isAnonymous ? 'anonymous' : 'email');
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await initiateEmailSignIn(auth, email, password);
      toast({
        title: 'Signing In...',
        description: 'You will be redirected shortly.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-in Failed',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await initiateEmailSignUp(auth, email, password);
      toast({
        title: 'Account Created!',
        description: 'Signing you in...',
      });
      if(userCredential?.user?.uid){
         logHistoryEvent(userCredential.user.uid, 'signup');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleSkip = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await initiateAnonymousSignIn(auth);
      toast({
        title: 'Signing in as Guest...',
        description: 'You will be redirected to the dashboard.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Guest Sign-in Failed',
        description: error.message,
      });
       setIsLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-lg font-bold">
          <Leaf className="h-6 w-6 text-primary" />
          <span>AgriAssist</span>
       </Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Enter your email to sign in or create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
             <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </Button>
            </div>
          </form>
        </CardContent>
         <CardFooter className="flex-col gap-4">
           <p className="text-xs text-muted-foreground">
            Don't have an account?
          </p>
          <Button variant="outline" className="w-full" onClick={handleSignUp} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
          </Button>

           <div className="flex items-center w-full my-2">
              <Separator className="flex-1" />
              <p className="px-4 text-xs text-muted-foreground">OR</p>
              <Separator className="flex-1" />
            </div>

            <Button variant="secondary" className="w-full" onClick={handleSkip} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Skip for now'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
