import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMongoData } from '@/hooks/useMongoData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import CreatePostDialog from '@/components/CreatePostDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import { User, Settings, FileText, Users, Zap, Plus, TrendingUp, Calendar, Heart, MessageSquare } from 'lucide-react';
import type { Post } from '@/types';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatarUrl: string;
  created_at: string;
}

interface UserRole {
  role: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const {
    userProfile,
    userRoles,
    posts,
    communities,
    userCommunities,
    loading: dataLoading,
    fetchPosts
  } = useMongoData();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    communitiesJoined: userCommunities.length
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && posts.length > 0) {
      // Filter user's posts - check multiple possible ID fields
      const myPosts = posts.filter(post =>
        post.author._id === user.id ||
        post.author._id === user.username ||
        post.authorName === user.username
      );
      setUserPosts(myPosts);

      // Calculate stats
      const totalLikes = myPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
      const totalComments = 0; // Comments not implemented yet

      setUserStats({
        totalPosts: myPosts.length,
        totalLikes,
        totalComments,
        communitiesJoined: userCommunities.length
      });
    }
  }, [user, posts, userCommunities]);

  // Add a separate effect to update stats when userCommunities changes
  useEffect(() => {
    setUserStats(prev => ({
      ...prev,
      communitiesJoined: userCommunities.length
    }));
  }, [userCommunities]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
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
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
              <p className="text-muted-foreground">Welcome {userProfile?.displayName || userProfile?.username || user?.display_name || user?.username || 'User'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <CreatePostDialog />
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>

          {/* Profile Overview */}
          <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userProfile?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {userProfile?.displayName?.charAt(0) || userProfile?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {userProfile?.displayName || userProfile?.username || user?.display_name || user?.username || 'User'}
                    </CardTitle>
                    <CardDescription>@{userProfile?.username || user?.username}</CardDescription>
                    {user?.email && (
                      <CardDescription className="text-xs text-muted-foreground mt-1">
                        {user.email}
                      </CardDescription>
                    )}
                    <div className="flex gap-2 mt-2">
                      {userRoles.map((role, index) => (
                        <Badge key={index} variant="secondary" className="capitalize">
                          {role.role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            {userProfile?.bio && (
              <CardContent>
                <p className="text-muted-foreground">{userProfile.bio}</p>
              </CardContent>
            )}
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{userStats.totalPosts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">{userStats.totalLikes}</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{userStats.totalComments}</div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{userStats.communitiesJoined}</div>
                <div className="text-sm text-muted-foreground">Communities</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
              className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              <CardContent className="p-6 text-center">
                <User className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Profile</h3>
                <p className="text-sm text-muted-foreground">Manage your profile</p>
              </CardContent>
            </Card>

            <Card
              className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer"
              onClick={() => navigate('/trending')}
            >
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Posts</h3>
                <p className="text-sm text-muted-foreground">Create and manage posts</p>
              </CardContent>
            </Card>

            <Card
              className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer"
              onClick={() => navigate('/community')}
            >
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Communities</h3>
                <p className="text-sm text-muted-foreground">Join discussions</p>
              </CardContent>
            </Card>

            <Card
              className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Settings</h3>
                <p className="text-sm text-muted-foreground">App preferences</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">My Posts</TabsTrigger>
              <TabsTrigger value="communities">Communities</TabsTrigger>
            </TabsList>


            <TabsContent value="posts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Posts ({userPosts.length})</h3>
                <CreatePostDialog trigger={
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                } />
              </div>
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              ) : (
                <Card className="glass">
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Share your first post with the community
                    </p>
                    <CreatePostDialog />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="communities" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Communities ({userCommunities.length})</h3>
                <Button variant="outline" size="sm" onClick={() => navigate('/community')}>
                  <Users className="w-4 h-4 mr-2" />
                  Browse All
                </Button>
              </div>
              {userCommunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {communities
                    .filter(community => userCommunities.includes(community._id))
                    .map((community) => (
                      <Card key={community._id} className="glass">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={community.avatar} />
                              <AvatarFallback>
                                {community.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold">{community.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {community.membersCount || community.members?.length || 0} members
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {community.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <Card className="glass">
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Join communities</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect with like-minded tech enthusiasts
                    </p>
                    <Button onClick={() => navigate('/community')}>
                      Explore Communities
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Admin Panel Access */}
          {(isAdmin || isModerator) && (
            <Card className="mt-8 border-amber-200/20 bg-amber-50/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <Zap className="h-5 w-5" />
                  {isAdmin ? 'Admin Panel' : 'Moderation Panel'}
                </CardTitle>
                <CardDescription>
                  You have {isAdmin ? 'administrator' : 'moderator'} privileges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Access {isAdmin ? 'Admin' : 'Moderation'} Panel
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