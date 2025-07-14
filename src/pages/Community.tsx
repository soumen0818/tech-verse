import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Plus, MessageSquare, Star } from 'lucide-react';

const Community = () => {
  const communities = [
    {
      id: 1,
      name: "JavaScript Developers",
      description: "A community for JavaScript enthusiasts and professionals",
      memberCount: 15600,
      postsToday: 23,
      category: "Programming",
      isJoined: false
    },
    {
      id: 2,
      name: "AI & Machine Learning",
      description: "Discuss the latest in artificial intelligence and ML",
      memberCount: 12300,
      postsToday: 18,
      category: "AI",
      isJoined: true
    },
    {
      id: 3,
      name: "Web Development",
      description: "Frontend, backend, and full-stack development discussions",
      memberCount: 20100,
      postsToday: 31,
      category: "Web Dev",
      isJoined: false
    },
    {
      id: 4,
      name: "Mobile Development",
      description: "iOS, Android, and cross-platform mobile development",
      memberCount: 8900,
      postsToday: 12,
      category: "Mobile",
      isJoined: false
    }
  ];

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
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          </div>
          <p className="text-muted-foreground">
            Join communities of like-minded tech enthusiasts and professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Card key={community.id} className="glass-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{community.name}</CardTitle>
                    <p className="text-muted-foreground text-sm mb-3">
                      {community.description}
                    </p>
                  </div>
                  <Badge variant="secondary">{community.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{community.memberCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{community.postsToday} today</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className={community.isJoined ? "w-full" : "btn-primary w-full"}
                  variant={community.isJoined ? "outline" : "default"}
                >
                  {community.isJoined ? (
                    <>
                      <Star className="w-4 h-4 mr-2" />
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
          ))}
        </div>
      </main>
    </div>
  );
};

export default Community;