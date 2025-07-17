import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  Zap,
  Home,
  TrendingUp,
  Users,
  Smile,
  Settings,
  LogIn
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now, just navigate to trending with search term
      // In a full implementation, you'd create a search results page
      toast({
        title: "Search initiated",
        description: `Searching for: ${searchQuery}`,
      });

      // Navigate to trending page (or search results page)
      navigate(`/trending?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Trending', href: '/trending', icon: TrendingUp },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Memes', href: '/memes', icon: Smile },
    { name: 'Quick News', href: '/quick-news', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover-glow">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center animate-glow-pulse">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>TechVerse</h1>
              <p className="text-xs text-muted-foreground font-mono">Connect</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tech news, discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border/30 focus:border-primary/50 focus:ring-primary/20"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2"
              onClick={() => {
                if (!user) {
                  toast({
                    title: "Authentication required",
                    description: "Please log in to view notifications",
                    variant: "destructive"
                  });
                  return;
                }
                toast({
                  title: "Notifications",
                  description: "No new notifications",
                });
              }}
            >
              <Bell className="w-5 h-5" />
              {/* No badge shown unless there are actual notifications */}
            </Button>

            {/* User Menu / Login-Logout */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden sm:flex"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="hidden sm:flex items-center space-x-2 btn-primary"
                onClick={handleLogin}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border/20 py-4 animate-fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-16 bg-muted/50 border-border/30"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-border/20">
                <Link
                  to="/settings"
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;