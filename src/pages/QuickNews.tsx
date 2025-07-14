import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, ExternalLink } from 'lucide-react';

const QuickNews = () => {
  const quickNews = [
    {
      id: 1,
      title: "OpenAI Releases GPT-5 Beta",
      summary: "Major improvements in reasoning and coding capabilities announced",
      source: "TechCrunch",
      timeAgo: "15 minutes ago",
      category: "AI",
      isBreaking: true
    },
    {
      id: 2,
      title: "Meta Announces New VR Headset",
      summary: "Next-generation Quest device with improved display resolution",
      source: "The Verge",
      timeAgo: "1 hour ago",
      category: "VR",
      isBreaking: false
    },
    {
      id: 3,
      title: "Apple Vision Pro Gets Price Cut",
      summary: "Significant price reduction announced at developer conference",
      source: "9to5Mac",
      timeAgo: "2 hours ago",
      category: "Apple",
      isBreaking: true
    },
    {
      id: 4,
      title: "Google Chrome 130 Released",
      summary: "New privacy features and performance improvements included",
      source: "Google Blog",
      timeAgo: "3 hours ago",
      category: "Browser",
      isBreaking: false
    },
    {
      id: 5,
      title: "Tesla FSD Beta Expands to Europe",
      summary: "Full self-driving beta now available in select European markets",
      source: "Electrek",
      timeAgo: "4 hours ago",
      category: "Tesla",
      isBreaking: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">Quick News</h1>
          </div>
          <p className="text-muted-foreground">
            Stay updated with the latest tech news in bite-sized summaries
          </p>
        </div>

        <div className="space-y-4">
          {quickNews.map((news) => (
            <Card key={news.id} className="glass-hover cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {news.isBreaking && (
                        <Badge className="bg-destructive text-destructive-foreground">
                          BREAKING
                        </Badge>
                      )}
                      <Badge variant="secondary">{news.category}</Badge>
                    </div>
                    <CardTitle className="text-lg mb-2 hover:text-primary transition-colors">
                      {news.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {news.summary}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground ml-4 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <span>{news.source}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{news.timeAgo}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            News updates every 15 minutes • Last updated: just now
          </p>
        </div>
      </main>
    </div>
  );
};

export default QuickNews;