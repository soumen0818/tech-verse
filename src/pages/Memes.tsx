import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Heart, MessageSquare, Share2, Upload, Copy, Mail } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import CreatePostDialog from '@/components/CreatePostDialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Memes page component
const Memes = () => {
  const { user } = useAuth();
  const { posts, toggleLike, isPostLiked, loading } = useSupabaseData();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter posts to show only memes
  const memes = posts.filter(post => post.category === 'meme');

  const handleShare = (post: any, platform: string) => {
    const url = window.location.origin;
    const text = `Check out this meme: ${post.title}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({ title: "Link copied to clipboard!" });
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

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
            <Button onClick={() => setCreateDialogOpen(true)} className="btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Share Meme
            </Button>
          </div>
          <p className="text-muted-foreground">
            Laugh with the community through the best tech humor and memes
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : memes.length === 0 ? (
          <div className="text-center py-8">
            <Smile className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No memes yet!</h3>
            <p className="text-muted-foreground mb-4">Be the first to share a funny tech meme</p>
            <Button onClick={() => setCreateDialogOpen(true)} className="btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Share Your Meme
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <Card key={meme.id} className="glass-hover cursor-pointer">
                <CardContent className="p-6">
                  {meme.featured_image_url ? (
                    <div className="aspect-square bg-muted/20 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={meme.featured_image_url} 
                        alt={meme.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted/20 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center p-4">
                        <Smile className="w-12 h-12 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{meme.title}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">{meme.title}</h3>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>By {meme.profiles?.username || 'Anonymous'}</span>
                      <span>{formatTimeAgo(meme.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/20">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`flex items-center space-x-1 ${isPostLiked(meme.id) ? 'text-red-500' : ''}`}
                        onClick={() => toggleLike(meme.id)}
                      >
                        <Heart className={`w-4 h-4 ${isPostLiked(meme.id) ? 'fill-current' : ''}`} />
                        <span>{meme.likes?.length || 0}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{meme.comments?.length || 0}</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleShare(meme, 'whatsapp')}>
                            WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(meme, 'copy')}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(meme, 'email')}>
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <CreatePostDialog 
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          defaultCategory="meme"
        />
      </main>
    </div>
  );
};

export default Memes;