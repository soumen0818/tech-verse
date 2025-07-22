import { useAuth } from '@/hooks/useAuth';
import { useMongoData } from '@/hooks/useMongoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Shield, Users, FileText, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const { posts, communities, isAdmin, userRoles, loading } = useMongoData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!loading && !isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="glass max-w-md w-full mx-4">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You don't have admin privileges to access this page.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalUsers = userRoles.length;
  const totalPosts = posts.length;
  const totalCommunities = communities.length;
  const totalComments = posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your TechVerse community</p>
            </div>
            <Badge variant="secondary" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Administrator</span>
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-primary">{totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                    <p className="text-2xl font-bold text-primary">{totalPosts}</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Communities</p>
                    <p className="text-2xl font-bold text-primary">{totalCommunities}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Comments</p>
                    <p className="text-2xl font-bold text-primary">{totalComments}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {post.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          By {post.profiles?.display_name || post.profiles?.username} • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Recent Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communities.slice(0, 5).map((community) => (
                    <div key={community.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="text-sm font-medium text-foreground">{community.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {community.member_count} members • {community.post_count} posts
                        </p>
                      </div>
                      <Badge variant="secondary">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="glass mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/community')}>
                  <Users className="w-6 h-6 mb-2" />
                  <span className="text-sm">Manage Communities</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/trending')}>
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-sm">View All Posts</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/settings')}>
                  <Shield className="w-6 h-6 mb-2" />
                  <span className="text-sm">Site Settings</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/dashboard')}>
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span className="text-sm">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;