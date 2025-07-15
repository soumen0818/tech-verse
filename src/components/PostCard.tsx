import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Share2, Eye, MoreHorizontal } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface PostCardProps {
  post: any;
  showActions?: boolean;
}

const PostCard = ({ post, showActions = true }: PostCardProps) => {
  const { toggleLike, isPostLiked } = useSupabaseData();
  const [isLiking, setIsLiking] = useState(false);
  const isLiked = isPostLiked(post.id);
  const likesCount = post.likes?.length || 0;

  const handleLike = async () => {
    setIsLiking(true);
    await toggleLike(post.id);
    setIsLiking(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt || post.content.substring(0, 100) + '...',
        url: window.location.href + '/post/' + post.id
      });
    } else {
      navigator.clipboard.writeText(window.location.href + '/post/' + post.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'yesterday';
    return date.toLocaleDateString();
  };

  return (
    <Card className="glass-hover cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.profiles?.avatar_url} />
              <AvatarFallback>
                {post.profiles?.display_name?.charAt(0) || post.profiles?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm">
                  {post.profiles?.display_name || post.profiles?.username || 'Anonymous'}
                </p>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-muted-foreground text-xs">
                  {formatDate(post.created_at)}
                </span>
                {post.communities && (
                  <>
                    <span className="text-muted-foreground text-xs">in</span>
                    <Badge variant="secondary" className="text-xs">
                      {post.communities.name}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="capitalize">
              {post.category}
            </Badge>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <CardTitle className="text-lg mb-2 hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          {post.excerpt && (
            <p className="text-muted-foreground text-sm mb-3">
              {post.excerpt}
            </p>
          )}
          {post.featured_image_url && (
            <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-3">
              <img 
                src={post.featured_image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`space-x-1 ${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments?.length || 0}</span>
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleShare} className="space-x-1">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-1 text-muted-foreground text-sm">
              <Eye className="h-4 w-4" />
              <span>{post.view_count || 0}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;