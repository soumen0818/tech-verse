import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Camera,
  Github,
  Twitter,
  Globe,
  MapPin,
  Calendar,
  Save,
  AlertTriangle
} from 'lucide-react';

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { userProfile, updateUserProfile, userRoles } = useSupabaseData();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    username: '',
    display_name: '',
    bio: '',
    location: '',
    website_url: '',
    twitter_handle: '',
    github_handle: '',
    avatar_url: ''
  });

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    community_updates: true,
    trending_alerts: false,
    post_likes: true,
    post_comments: true,
    new_followers: true
  });

  const [privacy, setPrivacy] = useState({
    profile_visibility: true,
    activity_tracking: true,
    data_sharing: false,
    show_email: false,
    show_location: true
  });

  const [appearance, setAppearance] = useState({
    dark_mode: false,
    compact_mode: false,
    animations: true,
    high_contrast: false
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (userProfile) {
      setProfile({
        username: userProfile.username || '',
        display_name: userProfile.display_name || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        website_url: userProfile.website_url || '',
        twitter_handle: userProfile.twitter_handle || '',
        github_handle: userProfile.github_handle || '',
        avatar_url: userProfile.avatar_url || ''
      });
    }
  }, [user, userProfile, navigate]);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    await updateUserProfile(profile);
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, you'd implement account deletion
      alert('Account deletion would be implemented here');
    }
  };

  if (!user) return null;

  const isAdmin = userRoles.some(role => role.role === 'admin');
  const isModerator = userRoles.some(role => role.role === 'moderator' || role.role === 'admin');

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              {isModerator && (
                <TabsTrigger value="moderation" className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="hidden sm:inline">Moderation</span>
                </TabsTrigger>
              )}
              {isAdmin && (
                <TabsTrigger value="admin" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {profile.display_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Avatar
                      </Button>
                      <div className="flex space-x-1">
                        {userRoles.map((role, index) => (
                          <Badge key={index} variant="secondary" className="text-xs capitalize">
                            {role.role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Your username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={profile.display_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                        placeholder="Your display name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website_url">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Website
                      </Label>
                      <Input
                        id="website_url"
                        value={profile.website_url}
                        onChange={(e) => setProfile(prev => ({ ...prev, website_url: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitter_handle">
                        <Twitter className="w-4 h-4 inline mr-1" />
                        Twitter Handle
                      </Label>
                      <Input
                        id="twitter_handle"
                        value={profile.twitter_handle}
                        onChange={(e) => setProfile(prev => ({ ...prev, twitter_handle: e.target.value }))}
                        placeholder="@username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github_handle">
                        <Github className="w-4 h-4 inline mr-1" />
                        GitHub Username
                      </Label>
                      <Input
                        id="github_handle"
                        value={profile.github_handle}
                        onChange={(e) => setProfile(prev => ({ ...prev, github_handle: e.target.value }))}
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleProfileUpdate} disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <div className="space-y-3">
                      {Object.entries({
                        email_notifications: 'Daily digest emails',
                        community_updates: 'Community updates',
                        trending_alerts: 'Trending content alerts',
                        post_likes: 'When someone likes your post',
                        post_comments: 'When someone comments on your post',
                        new_followers: 'New followers'
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={key} className="text-sm font-normal">{label}</Label>
                          <Switch
                            id={key}
                            checked={notifications[key as keyof typeof notifications]}
                            onCheckedChange={(checked) => 
                              setNotifications(prev => ({ ...prev, [key]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Push Notifications</h4>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push_notifications" className="text-sm font-normal">
                        Enable push notifications
                      </Label>
                      <Switch
                        id="push_notifications"
                        checked={notifications.push_notifications}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, push_notifications: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Privacy & Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {Object.entries({
                      profile_visibility: 'Make profile public',
                      activity_tracking: 'Allow activity tracking for better recommendations',
                      data_sharing: 'Share anonymized data for platform improvements',
                      show_email: 'Show email in public profile',
                      show_location: 'Show location in public profile'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-sm font-normal">{label}</Label>
                        <Switch
                          id={key}
                          checked={privacy[key as keyof typeof privacy]}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                    <div className="border border-destructive/20 rounded-lg p-4 space-y-3">
                      <div>
                        <h5 className="font-medium text-destructive">Delete Account</h5>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Appearance & Display</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {Object.entries({
                      dark_mode: 'Dark mode',
                      compact_mode: 'Compact view',
                      animations: 'Enable animations',
                      high_contrast: 'High contrast mode'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-sm font-normal">{label}</Label>
                        <Switch
                          id={key}
                          checked={appearance[key as keyof typeof appearance]}
                          onCheckedChange={(checked) => 
                            setAppearance(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Moderation Panel */}
            {isModerator && (
              <TabsContent value="moderation" className="space-y-6">
                <Card className="glass border-amber-200/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-amber-600">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Moderation Panel</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        As a moderator, you have access to content moderation tools.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline">
                          Review Reported Content
                        </Button>
                        <Button variant="outline">
                          Manage User Reports
                        </Button>
                        <Button variant="outline">
                          Content Analytics
                        </Button>
                        <Button variant="outline">
                          Moderation Log
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Admin Panel */}
            {isAdmin && (
              <TabsContent value="admin" className="space-y-6">
                <Card className="glass border-red-200/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-600">
                      <Settings className="w-5 h-5" />
                      <span>Admin Panel</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Full administrative access to platform management.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline">
                          User Management
                        </Button>
                        <Button variant="outline">
                          Community Management
                        </Button>
                        <Button variant="outline">
                          System Analytics
                        </Button>
                        <Button variant="outline">
                          Platform Settings
                        </Button>
                        <Button variant="outline">
                          Database Management
                        </Button>
                        <Button variant="outline">
                          Content Moderation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;