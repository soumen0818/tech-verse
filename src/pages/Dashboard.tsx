import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { User, Settings, FileText, Users, Zap } from 'lucide-react';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  created_at: string;
}

interface UserRole {
  role: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id);

      if (rolesError) {
        console.error('Roles fetch error:', rolesError);
      } else {
        setUserRoles(rolesData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = userRoles.some(role => role.role === 'admin');
  const isModerator = userRoles.some(role => role.role === 'moderator');

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back to TechVerse Connect</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>

          {/* Profile Card */}
          <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">
                    {profile?.display_name || profile?.username || 'User'}
                  </CardTitle>
                  <CardDescription>@{profile?.username}</CardDescription>
                  <div className="flex gap-2 mt-2">
                    {userRoles.map((role, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">
                        {role.role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            {profile?.bio && (
              <CardContent>
                <p className="text-muted-foreground">{profile.bio}</p>
              </CardContent>
            )}
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <User className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Profile</h3>
                <p className="text-sm text-muted-foreground">Manage your profile</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Posts</h3>
                <p className="text-sm text-muted-foreground">Create and manage posts</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Communities</h3>
                <p className="text-sm text-muted-foreground">Join discussions</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Settings</h3>
                <p className="text-sm text-muted-foreground">App preferences</p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Panel Access */}
          {(isAdmin || isModerator) && (
            <Card className="border-destructive/20 bg-destructive/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-destructive" />
                  Admin Panel
                </CardTitle>
                <CardDescription>
                  You have {isAdmin ? 'administrator' : 'moderator'} privileges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">
                  Access Admin Panel
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;