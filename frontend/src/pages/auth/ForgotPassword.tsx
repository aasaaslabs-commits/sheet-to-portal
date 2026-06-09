import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/api/auth';
import { useAppStore } from '@/store/useAppStore';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const setLoading = useAppStore((state) => state.setLoading);
  const isLoading = useAppStore((state) => state.isLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authService.forgotPassword({ email });
      setIsSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We have sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full" variant="outline">
            <Link to="/auth/login">Back to login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Forgot password</CardTitle>
        <CardDescription>Enter your email address and we will send you a link to reset your password.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending link...' : 'Send reset link'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Remember your password?{' '}
            <Link to="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
