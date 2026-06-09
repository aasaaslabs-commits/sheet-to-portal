import React, { useState } from 'react';
import { User as UserIcon, Mail, Calendar, Shield, MapPin, Building, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/api/auth';

export const Profile = () => {
  const { user, token, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');
  const [company, setCompany] = useState(user?.company || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setIsLoading(true);
      setMessage(null);
      const data = await authService.updateProfile(token, { 
        name,
        jobTitle,
        company,
        bio,
        ...(password ? { password } : {}) 
      });
      updateUser(data.user);
      setPassword('');
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-destructive/10 border-destructive/20 text-destructive'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background mb-4 shadow-sm">
              <UserIcon className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>{user?.name || 'User'}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.jobTitle && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Building className="w-4 h-4 text-primary" />
                <span>{user.jobTitle} {user.company ? `at ${user.company}` : ''}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Administrator</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Joined June 2026</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <form onSubmit={handleUpdateProfile}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and how others see you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue={user?.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job">Job Title</Label>
                  <Input 
                    id="job" 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)} 
                    placeholder="e.g. Data Analyst" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)} 
                    placeholder="e.g. Acme Inc." 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  placeholder="Tell us about yourself" 
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => {
                  setName(user?.name || '');
                  setJobTitle(user?.jobTitle || '');
                  setCompany(user?.company || '');
                  setBio(user?.bio || '');
                  setPassword('');
                  setMessage(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};
