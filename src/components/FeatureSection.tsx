import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Newspaper,
  MessageSquare,
  Users,
  Smile,
  Zap,
  Search,
  Shield,
  Settings,
  TrendingUp,
  Bell,
  Share2,
  Heart
} from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: Newspaper,
      title: 'Latest Tech News',
      description: 'Stay updated with the latest technology news, product launches, and industry insights from trusted sources.',
      badge: 'News',
      color: 'text-primary'
    },
    {
      icon: MessageSquare,
      title: 'Discussion Forums',
      description: 'Engage in meaningful discussions with fellow tech enthusiasts about trending topics and emerging technologies.',
      badge: 'Community',
      color: 'text-secondary'
    },
    {
      icon: Users,
      title: 'Tech Communities',
      description: 'Join specialized communities focused on different tech domains like AI, Web Dev, Mobile, and more.',
      badge: 'Social',
      color: 'text-accent'
    },
    {
      icon: Smile,
      title: 'Tech Memes',
      description: 'Laugh with the community through technology-related memes, jokes, and light-hearted content.',
      badge: 'Fun',
      color: 'text-warning'
    },
    {
      icon: Zap,
      title: 'Quick News',
      description: 'Get 24-hour tech news summaries and quick updates on the most important tech events.',
      badge: 'Fast',
      color: 'text-primary'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find exactly what you\'re looking for with our powerful search engine across all content types.',
      badge: 'Search',
      color: 'text-secondary'
    },
    {
      icon: Shield,
      title: 'Moderated Content',
      description: 'Our admin panel ensures high-quality content with active moderation and community guidelines.',
      badge: 'Safe',
      color: 'text-success'
    },
    {
      icon: TrendingUp,
      title: 'Trending Analytics',
      description: 'Discover what\'s trending in the tech world with real-time analytics and engagement metrics.',
      badge: 'Insights',
      color: 'text-accent'
    }
  ];

  const socialFeatures = [
    { icon: Heart, text: 'Like & React' },
    { icon: MessageSquare, text: 'Comment' },
    { icon: Share2, text: 'Share' },
    { icon: Bell, text: 'Follow' }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 px-4 py-2 bg-primary/10 border-primary/20 text-primary">
            Platform Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need for
            <br />
            <span className="text-primary" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>Tech Discovery</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A comprehensive platform designed for tech enthusiasts, professionals,
            and curious minds to stay informed, connected, and entertained.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="glass-hover group cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start w-full gap-3 sm:gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-xl bg-primary/10 ${feature.color} group-hover:scale-110 transition-transform duration-300`} style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0 max-w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                      <h3 className="font-semibold text-foreground break-words max-w-full">{feature.title}</h3>
                      <Badge variant="secondary" className="text-xs w-fit">{feature.badge}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed break-words max-w-full">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Features Highlight */}
        <div className="glass rounded-3xl p-8 text-center animate-fade-in-up">
          <h3 className="text-2xl font-bold mb-4 text-primary" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
            Interactive Social Features
          </h3>
          <p className="text-muted-foreground mb-6">
            Engage with the community through various social interactions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {socialFeatures.map((social, index) => (
              <div
                key={social.text}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                <social.icon className="w-5 h-5" />
                <span className="font-medium">{social.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
    </section>
  );
};

export default FeatureSection;