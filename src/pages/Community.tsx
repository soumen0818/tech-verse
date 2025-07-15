import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import Header from '@/components/Header';
import CreateCommunityDialog from '@/components/CreateCommunityDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, MessageSquare, Star, Crown } from 'lucide-react';

const Community = () => {
  const { user } = useAuth();
  const { 
    communities, 
    userCommunities, 
    toggleCommunityMembership, 
    isUserJoined,
    loading 
  } = useSupabaseData();
  const { toast } = useToast();

  const handleJoinToggle = async (communityId: string, communityName: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join communities",
        variant: "destructive"
      });
      return;
    }
    
    await toggleCommunityMembership(communityId);
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
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold gradient-text">Communities</h1>
            </div>
            {user && <CreateCommunityDialog />}
          </div>
          <p className="text-muted-foreground">
            Join communities of like-minded tech enthusiasts and professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.length > 0 ? (
            communities.map((community) => {
              const isJoined = isUserJoined(community.id);
              const memberCount = community.member_count || 0;
              const postsCount = community.post_count || 0;
              
              return (
                <Card key={community.id} className="glass-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={community.avatar_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {community.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{community.name}</CardTitle>
                          <p className="text-muted-foreground text-sm mb-2">
                            {community.description || 'A vibrant tech community'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        <Crown className="w-3 h-3 mr-1" />
                        Community
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{memberCount} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{postsCount} posts</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className={isJoined ? "w-full" : "btn-primary w-full"}
                      variant={isJoined ? "outline" : "default"}
                      onClick={() => handleJoinToggle(community.id, community.name)}
                    >
                      {isJoined ? (
                        <>
                          <Star className="w-4 h-4 mr-2 fill-current" />
                          Joined
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Join Community
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full">
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No communities yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to create a community and bring people together!
                  </p>
                  {user && <CreateCommunityDialog />}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Community;