import { useState } from 'react';
import { useLocation } from 'wouter';
import { CheckSquare, Eye, EyeOff, ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type AuthMode = 'signin' | 'signup' | 'verify';

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { signIn, signUp, verifyOtp, resendVerificationEmail, isAuthenticated } = useSupabaseAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isResending, setIsResending] = useState(false);

  if (isAuthenticated) {
    setLocation('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await signUp(email, password, firstName, lastName);
        if (error) {
          toast({
            title: 'Sign up failed',
            description: error.message,
            variant: 'destructive',
          });
        } else if (data?.user && !data.session) {
          setMode('verify');
          toast({
            title: 'Verification code sent',
            description: 'We sent a 6-digit code to your email. Enter it below to verify your account.',
          });
        } else if (data?.session) {
          toast({
            title: 'Account created',
            description: 'Welcome to TaskFlow!',
          });
          setLocation('/');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          let message = error.message;
          if (error.message.includes('Email not confirmed')) {
            message = 'Please verify your email before signing in. Check your inbox for the verification code.';
            setMode('verify');
          }
          toast({
            title: 'Sign in failed',
            description: message,
            variant: 'destructive',
          });
        } else {
          setLocation('/');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter the 6-digit code from your email.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await verifyOtp(email, otpCode, 'signup');
      if (error) {
        toast({
          title: 'Verification failed',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data?.session) {
        toast({
          title: 'Email verified',
          description: 'Your account is now active. Welcome to TaskFlow!',
        });
        setLocation('/');
      } else {
        toast({
          title: 'Email verified',
          description: 'You can now sign in with your credentials.',
        });
        setMode('signin');
        setOtpCode('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const { error } = await resendVerificationEmail(email);
      if (error) {
        toast({
          title: 'Failed to resend',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Code resent',
          description: 'Check your email for the new verification code.',
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setOtpCode('');
  };

  if (mode === 'verify') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setMode('signin')} data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CheckSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">TaskFlow</span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold" data-testid="text-verify-title">
                Verify your email
              </CardTitle>
              <CardDescription data-testid="text-verify-description">
                Enter the 6-digit code we sent to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(value) => setOtpCode(value)}
                  data-testid="input-otp"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Alert>
                <AlertDescription>
                  Check your inbox and spam folder for the verification email. The code expires in 1 hour.
                </AlertDescription>
              </Alert>

              <Button 
                className="w-full" 
                onClick={handleVerifyOtp}
                disabled={isLoading || otpCode.length !== 6}
                data-testid="button-verify-otp"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleResendCode}
                  disabled={isResending}
                  data-testid="button-resend-code"
                >
                  <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? 'Resending...' : 'Resend verification code'}
                </Button>
                
                <Button 
                  variant="ghost"
                  className="w-full"
                  onClick={() => setMode('signin')}
                  data-testid="button-back-to-signin"
                >
                  Back to sign in
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/')} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold" data-testid="text-auth-title">
              {mode === 'signin' ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription data-testid="text-auth-description">
              {mode === 'signin'
                ? 'Enter your credentials to access your tasks'
                : 'Enter your details to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      data-testid="input-firstname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      data-testid="input-lastname"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-submit"
              >
                {isLoading
                  ? (mode === 'signin' ? 'Signing in...' : 'Creating account...')
                  : (mode === 'signin' ? 'Sign in' : 'Create account')}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-primary hover:underline"
                data-testid="button-toggle-mode"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
