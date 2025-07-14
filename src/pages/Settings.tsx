import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

const SettingsPage = () => {
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
            Customize your TechVerse Connect experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Your username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself" />
              </div>
              <Button className="w-full">Update Profile</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email notifications</Label>
                <Switch id="email-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push notifications</Label>
                <Switch id="push-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="community-updates">Community updates</Label>
                <Switch id="community-updates" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="trending-alerts">Trending alerts</Label>
                <Switch id="trending-alerts" />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-visibility">Public profile</Label>
                <Switch id="profile-visibility" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="activity-tracking">Activity tracking</Label>
                <Switch id="activity-tracking" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="data-sharing">Data sharing</Label>
                <Switch id="data-sharing" />
              </div>
              <Separator />
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Appearance Settings */}
        <Card className="glass mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark mode</Label>
                <Switch id="dark-mode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-mode">Compact view</Label>
                <Switch id="compact-mode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animations">Animations</Label>
                <Switch id="animations" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SettingsPage;