import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, MessageSquare, Heart } from 'lucide-react';

const Trending = () => {
  const trendingPosts = [
    {
      id: 1,
      title: "The Future of AI in Software Development",
      excerpt: "How artificial intelligence is revolutionizing the way we write code...",
      category: "AI",
      views: 12500,
      comments: 234,
      likes: 890,
      author: "TechGuru",
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      title: "Web 3.0: What You Need to Know",
      excerpt: "Understanding the next evolution of the internet and its implications...",
      category: "Web3",
      views: 8900,
      comments: 156,
      likes: 567,
      author: "CryptoExpert",
      timeAgo: "4 hours ago"
    },
    {
      id: 3,
      title: "React 19: New Features and Breaking Changes",
      excerpt: "A comprehensive guide to the latest React updates and what they mean...",
      category: "React",
      views: 15600,
      comments: 78,
      likes: 1200,
      author: "ReactPro",
      timeAgo: "6 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">Trending Now</h1>
          </div>
          <p className="text-muted-foreground">
            Discover the hottest tech topics and discussions everyone's talking about
          </p>
        </div>

        <div className="grid gap-6">
          {trendingPosts.map((post) => (
            <Card key={post.id} className="glass-hover cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mb-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <Badge className="ml-4">{post.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>By {post.author}</span>
                    <span>{post.timeAgo}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Trending;