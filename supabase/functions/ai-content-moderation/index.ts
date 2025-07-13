import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModerationRequest {
  content: string;
  postId?: string;
  commentId?: string;
  type: 'post' | 'comment';
}

interface ModerationResult {
  isAppropriate: boolean;
  confidence: number;
  reasons: string[];
  suggestedAction: 'approve' | 'flag' | 'reject';
}

const moderateContent = async (content: string): Promise<ModerationResult> => {
  try {
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
            content: `You are a content moderation AI for a technology news and discussion platform called TechVerse Connect. 
            
            Your job is to analyze content and determine if it's appropriate for the platform. Focus on:
            
            REJECT content that contains:
            - Hate speech, harassment, or personal attacks
            - Spam or promotional content unrelated to technology
            - Explicit sexual content or violence
            - Misinformation or conspiracy theories
            - Illegal activities or dangerous instructions
            
            FLAG content that:
            - May be controversial but is tech-related
            - Contains strong opinions but isn't abusive
            - Has minor promotional aspects but is still valuable to the community
            
            APPROVE content that:
            - Discusses technology topics constructively
            - Shares tech news, tutorials, or insights
            - Asks genuine tech-related questions
            - Provides helpful responses and solutions
            - Contains appropriate tech humor/memes
            
            Respond in JSON format with:
            {
              "isAppropriate": boolean,
              "confidence": number (0-1),
              "reasons": ["reason1", "reason2"],
              "suggestedAction": "approve" | "flag" | "reject"
            }`
          },
          {
            role: 'user',
            content: `Please moderate this content: "${content}"`
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return result;
  } catch (error) {
    console.error('Error in AI moderation:', error);
    // Fallback to basic keyword filtering if AI fails
    return performBasicModeration(content);
  }
};

const performBasicModeration = (content: string): ModerationResult => {
  const flaggedKeywords = [
    'spam', 'scam', 'hate', 'kill', 'die', 'stupid', 'idiot', 
    'buy now', 'click here', 'free money', 'get rich quick'
  ];
  
  const lowerContent = content.toLowerCase();
  const foundKeywords = flaggedKeywords.filter(keyword => lowerContent.includes(keyword));
  
  if (foundKeywords.length > 0) {
    return {
      isAppropriate: false,
      confidence: 0.8,
      reasons: [`Contains flagged keywords: ${foundKeywords.join(', ')}`],
      suggestedAction: 'flag'
    };
  }
  
  return {
    isAppropriate: true,
    confidence: 0.6,
    reasons: ['Passed basic keyword filter'],
    suggestedAction: 'approve'
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, postId, commentId, type }: ModerationRequest = await req.json();
    
    if (!content) {
      throw new Error('Content is required for moderation');
    }

    console.log(`Moderating ${type}: ${content.substring(0, 100)}...`);
    
    // Perform AI-powered content moderation
    const moderationResult = await moderateContent(content);
    
    console.log('Moderation result:', moderationResult);
    
    // If using Supabase, you could log the moderation result
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Log moderation result (you'd need to create a moderation_logs table)
      /*
      await supabase.from('moderation_logs').insert({
        content_id: postId || commentId,
        content_type: type,
        is_appropriate: moderationResult.isAppropriate,
        confidence: moderationResult.confidence,
        reasons: moderationResult.reasons,
        suggested_action: moderationResult.suggestedAction,
        created_at: new Date().toISOString()
      });
      */
    }

    return new Response(JSON.stringify({
      success: true,
      moderation: moderationResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in content moderation function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});