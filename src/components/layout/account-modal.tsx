
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useAuth,
  useUser,
  initiateEmailSignIn,
  initiateEmailSignUp,
  initiateGoogleSignIn,
} from '@/firebase';
import { getAuth, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { Loader2, User, LogOut, Mail, Phone, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { SidebarMenuButton } from '../ui/sidebar';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-.83 0-1 .42-1 .98V12h2.5l-.5 3H13v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);

function PasswordResetDialog({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ variant: 'destructive', title: 'Email Required', description: 'Please enter your email to reset your password.' });
      return;
    }
    setIsLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast({ title: 'Password Reset Email Sent', description: 'Check your inbox for instructions.' });
      onOpenChange(false); // Close this dialog
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Password Reset Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="w-full">Forgot password?</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Enter your email to receive a password reset link.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-reset">Email</Label>
            <Input id="email-reset" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function AccountModal() {
  const { user, isUserLoading } = useUser();
  const firebaseAuth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(firebaseAuth);
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
      setOpen(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign-out Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await initiateGoogleSignIn(firebaseAuth);
      toast({ title: 'Signing in with Google...' });
      setOpen(false);
    } catch (error: any) {
       toast({ variant: 'destructive', title: 'Google Sign-in Failed', description: error.message });
       setIsLoading(false);
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await initiateEmailSignIn(firebaseAuth, email, password);
      toast({ title: 'Signing In...', description: 'Welcome back!' });
      setOpen(false); // Close modal on success
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign-in Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await initiateEmailSignUp(firebaseAuth, email, password);
      toast({ title: 'Account Created!', description: 'Signing you in...' });
      setOpen(false); // Close modal on success
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign-up Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserContent = () => (
    <div className='p-6 text-center'>
      <DialogHeader>
        <DialogTitle>Account</DialogTitle>
        <DialogDescription>
          You are signed in as {user?.isAnonymous ? 'a guest' : user?.email}.
        </DialogDescription>
      </DialogHeader>
      <Button onClick={handleSignOut} disabled={isLoading} className="mt-4 w-full">
        {isLoading ? <Loader2 className="animate-spin" /> : <LogOut className='mr-2' />}
        Sign Out
      </Button>
    </div>
  );

  const renderGuestContent = () => (
     <Tabs defaultValue="signin" className="w-full">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>Join or Sign In</DialogTitle>
        <DialogDescription>
          Choose a method below to access your account.
        </DialogDescription>
      </DialogHeader>
      <div className='p-6 pt-0'>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Create Account</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <form onSubmit={handleSignIn} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email-signin">Email</Label>
            <Input id="email-signin" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-signin">Password</Label>
            <Input id="password-signin" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </Button>
          <PasswordResetDialog onOpenChange={setResetDialogOpen} />
        </form>
      </TabsContent>
      <TabsContent value="signup">
         <form onSubmit={handleSignUp} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email-signup">Email</Label>
            <Input id="email-signup" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-signup">Password</Label>
            <Input id="password-signup" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </Button>
        </form>
      </TabsContent>

      <div className="flex items-center w-full my-4">
          <Separator className="flex-1" />
          <p className="px-4 text-xs text-muted-foreground">OR</p>
          <Separator className="flex-1" />
        </div>

        <div className='space-y-2'>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                <GoogleIcon />
                <span className='ml-2'>Sign in with Google</span>
            </Button>
            <Button variant="outline" className="w-full" disabled>
                <FacebookIcon />
                <span className='ml-2'>Sign in with Facebook</span>
            </Button>
            <Button variant="outline" className="w-full" disabled>
                <Phone className="h-5 w-5" />
                <span className='ml-2'>Sign in with Phone</span>
            </Button>
        </div>
      </div>
     </Tabs>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => {
        if (resetDialogOpen) return;
        setOpen(o);
    }}>
      <DialogTrigger asChild>
        <SidebarMenuButton tooltip="Account">
          {isUserLoading ? (
            <Loader2 className="animate-spin" />
          ) : user ? (
            <User />
          ) : (
            <User />
          )}
          <span>Account</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-sm">
        {isUserLoading ? (
          <div className="p-6 text-center"><Loader2 className="animate-spin mx-auto" /></div>
        ) : user ? (
          renderUserContent()
        ) : (
          renderGuestContent()
        )}
      </DialogContent>
    </Dialog>
  );
}
