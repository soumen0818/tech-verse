import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import CreatePostDialog from '@/components/CreatePostDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus } from 'lucide-react';

const Trending = () => {
  const { user } = useAuth();
  const { posts, loading, fetchPosts } = useSupabaseData();

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter and sort posts by view count and likes for trending
  const trendingPosts = posts
    .filter(post => post.is_published)
    .sort((a, b) => {
      const scoreA = (a.view_count || 0) + (a.likes?.length || 0) * 5;
      const scoreB = (b.view_count || 0) + (b.likes?.length || 0) * 5;
      return scoreB - scoreA;
    })
    .slice(0, 20);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold text-primary">Trending Now</h1>
            </div>
            {user && (
              <CreatePostDialog trigger={
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              } />
            )}
          </div>
          <p className="text-muted-foreground">
            Discover the hottest tech topics and discussions everyone's talking about
          </p>
        </div>

        <div className="space-y-6">
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post, index) => (
              <div key={post.id} className="relative">
                {index < 3 && (
                  <div className="absolute -left-4 top-4 z-10">
                    <div className="bg-gradient-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                      #{index + 1}
                    </div>
                  </div>
                )}
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <Card className="glass">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No trending posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to create engaging content that gets the community talking!
                </p>
                {user && <CreatePostDialog />}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Trending;