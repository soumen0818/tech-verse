import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Users, Zap } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto text-center">
        {/* Background Card */}
        <div className="relative glass rounded-3xl p-12 lg:p-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 tech-grid opacity-10" />
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 bg-primary/20 border-primary/30 text-primary animate-glow-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              Join the Community
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Ready to Dive into the
              <br />
              <span className="gradient-text">Tech Universe?</span>
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up">
              Join thousands of tech enthusiasts, share your insights, discover the latest trends, 
              and be part of conversations that shape the future of technology.
            </p>

            {/* Stats Row */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="w-5 h-5 text-primary" />
                <span>50,000+ Active Members</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Zap className="w-5 h-5 text-secondary" />
                <span>Daily Fresh Content</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button className="btn-primary text-lg px-8 py-4 group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="btn-ghost text-lg px-8 py-4">
                Explore Features
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-border/20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <p className="text-sm text-muted-foreground mb-4">Trusted by developers from</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="font-mono text-lg font-bold">Google</div>
                <div className="font-mono text-lg font-bold">Microsoft</div>
                <div className="font-mono text-lg font-bold">Meta</div>
                <div className="font-mono text-lg font-bold">Apple</div>
                <div className="font-mono text-lg font-bold">Netflix</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;