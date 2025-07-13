import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const newsApiKey = Deno.env.get('NEWS_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

interface ProcessedNews {
  title: string;
  summary: string;
  category: string;
  importance: number;
  originalUrl: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

const fetchTechNews = async (): Promise<NewsArticle[]> => {
  try {
    // Using a free tech news API or RSS feeds
    const techSources = [
      'techcrunch',
      'ars-technica',
      'the-verge',
      'wired',
      'engadget'
    ];

    const articles: NewsArticle[] = [];
    
    // Fetch from multiple sources
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?domains=techcrunch.com,arstechnica.com,theverge.com,wired.com,engadget.com&language=en&sortBy=publishedAt&pageSize=20&apiKey=${newsApiKey}`
    );
    
    if (newsResponse.ok) {
      const newsData = await newsResponse.json();
      
      newsData.articles.forEach((article: any) => {
        if (article.title && article.description && !article.title.includes('[Removed]')) {
          articles.push({
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
            imageUrl: article.urlToImage
          });
        }
      });
    }

    // Fallback: Fetch from tech RSS feeds if News API fails
    if (articles.length === 0) {
      // You could add RSS parsing here
      console.log('Falling back to RSS feeds...');
    }

    return articles.slice(0, 10); // Return top 10 articles
  } catch (error) {
    console.error('Error fetching tech news:', error);
    return [];
  }
};

const processNewsWithAI = async (articles: NewsArticle[]): Promise<ProcessedNews[]> => {
  try {
    const processedNews: ProcessedNews[] = [];

    for (const article of articles) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a tech news curator for TechVerse Connect. Analyze tech articles and provide structured summaries.
              
              For each article, provide a JSON response with:
              {
                "summary": "A concise 2-3 sentence summary",
                "category": "One of: AI, Web Development, Mobile, Hardware, Cybersecurity, Gaming, Startups, Other",
                "importance": "A number from 1-10 indicating how important/interesting this news is to tech community"
              }
              
              Focus on making summaries engaging and highlighting why this matters to developers and tech enthusiasts.`
            },
            {
              role: 'user',
              content: `Title: ${article.title}\nDescription: ${article.description}`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiAnalysis = JSON.parse(data.choices[0].message.content);
        
        processedNews.push({
          title: article.title,
          summary: aiAnalysis.summary,
          category: aiAnalysis.category,
          importance: aiAnalysis.importance,
          originalUrl: article.url,
          source: article.source,
          publishedAt: article.publishedAt,
          imageUrl: article.imageUrl
        });
      }
    }

    return processedNews.sort((a, b) => b.importance - a.importance);
  } catch (error) {
    console.error('Error processing news with AI:', error);
    // Fallback: return basic processed news
    return articles.map(article => ({
      title: article.title,
      summary: article.description,
      category: 'Other',
      importance: 5,
      originalUrl: article.url,
      source: article.source,
      publishedAt: article.publishedAt,
      imageUrl: article.imageUrl
    }));
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting tech news aggregation...');
    
    // Fetch latest tech news
    const articles = await fetchTechNews();
    console.log(`Fetched ${articles.length} articles`);
    
    if (articles.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No articles found'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process news with AI if OpenAI key is available
    let processedNews = articles.map(article => ({
      title: article.title,
      summary: article.description,
      category: 'Other' as const,
      importance: 5,
      originalUrl: article.url,
      source: article.source,
      publishedAt: article.publishedAt,
      imageUrl: article.imageUrl
    }));

    if (openAIApiKey) {
      console.log('Processing news with AI...');
      processedNews = await processNewsWithAI(articles);
    }

    // Store in Supabase if configured
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // You would need to create a news_articles table
      /*
      const newsInserts = processedNews.map(news => ({
        title: news.title,
        summary: news.summary,
        category: news.category,
        importance: news.importance,
        original_url: news.originalUrl,
        source: news.source,
        published_at: news.publishedAt,
        image_url: news.imageUrl,
        created_at: new Date().toISOString()
      }));

      await supabase.from('news_articles').upsert(newsInserts, {
        onConflict: 'original_url'
      });
      */
    }

    console.log(`Successfully processed ${processedNews.length} news articles`);

    return new Response(JSON.stringify({
      success: true,
      articles: processedNews,
      totalProcessed: processedNews.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in tech news aggregator:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});