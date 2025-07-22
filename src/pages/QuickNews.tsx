import { useEffect } from 'react';
import { useMongoData } from '@/hooks/useMongoData';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Clock, ExternalLink, RefreshCw } from 'lucide-react';

const QuickNews = () => {
  const { posts, loading, fetchPosts } = useMongoData();

  useEffect(() => {
    fetchPosts('quick_news');
  }, []);

  // Filter for quick news posts and sort by latest
  const quickNewsPosts = posts
    .filter(post => post.category === 'quick_news' && post.is_published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const refreshNews = () => {
    fetchPosts('quick_news');
  };

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
              <Zap className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold text-primary">Quick News</h1>
            </div>
            <Button variant="outline" onClick={refreshNews} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <p className="text-muted-foreground">
            Stay updated with the latest tech news in bite-sized summaries
          </p>
        </div>

        {/* Real-time news ticker */}
        <Card className="glass mb-6 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-sm">
              <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-muted-foreground">
                  🔥 Breaking: Latest tech updates • AI developments • Developer tools • Industry insights
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {quickNewsPosts.length > 0 ? (
            quickNewsPosts.map((post) => (
              <Card key={post.id} className="glass-hover cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          QUICK NEWS
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {post.category.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(post.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-2 hover:text-primary transition-colors group-hover:text-primary">
                        {post.title}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                {/* Optional: Show author info for quick news */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <span>By {post.profiles?.displayName || post.profiles?.username || 'News Bot'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="glass">
              <CardContent className="p-8 text-center">
                <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No quick news available</h3>
                <p className="text-muted-foreground mb-4">
                  Check back soon for the latest tech news updates
                </p>
                <Button variant="outline" onClick={refreshNews}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check for Updates
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates • Last refreshed: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuickNews;