import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Heart, MessageSquare, Share2, Upload } from 'lucide-react';

const Memes = () => {
  const memes = [
    {
      id: 1,
      title: "When you fix a bug but create 3 new ones",
      likes: 1200,
      comments: 45,
      shares: 23,
      author: "CodeMaster",
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      title: "CSS: It works on my machine",
      likes: 890,
      comments: 32,
      shares: 18,
      author: "WebDevHumor",
      timeAgo: "4 hours ago"
    },
    {
      id: 3,
      title: "Me explaining why I need 32GB RAM for web development",
      likes: 1560,
      comments: 67,
      shares: 41,
      author: "TechMemes",
      timeAgo: "6 hours ago"
    },
    {
      id: 4,
      title: "Production server at 3 AM",
      likes: 2100,
      comments: 89,
      shares: 56,
      author: "DevOpsLife",
      timeAgo: "8 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Smile className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold gradient-text">Tech Memes</h1>
            </div>
            <Button className="btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Share Meme
            </Button>
          </div>
          <p className="text-muted-foreground">
            Laugh with the community through the best tech humor and memes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <Card key={meme.id} className="glass-hover cursor-pointer">
              <CardContent className="p-6">
                <div className="aspect-square bg-muted/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Smile className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{meme.title}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">{meme.title}</h3>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {meme.author}</span>
                    <span>{meme.timeAgo}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/20">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{meme.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{meme.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <Share2 className="w-4 h-4" />
                      <span>{meme.shares}</span>
                    </Button>
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

export default Memes;