import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, TrendingUp, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-tech.jpg';

const Hero = () => {
  const navigate = useNavigate();
  
  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Daily Posts', value: '1.2K+', icon: TrendingUp },
    { label: 'Tech Communities', value: '200+', icon: Sparkles },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="TechVerse Connect Hero" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-primary/10" />
        <div className="absolute inset-0 tech-grid opacity-30" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-tech-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-tech-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-tech-float" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <Badge className="px-4 py-2 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-all duration-300">
              <Zap className="w-4 h-4 mr-2" />
              Welcome to the Future of Tech News
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="gradient-text">TechVerse</span>
            <br />
            <span className="text-foreground">Connect</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Your ultimate destination for technology news, insightful discussions, 
            and a thriving community of tech enthusiasts. Stay ahead of the curve 
            with real-time updates and expert analysis.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button className="btn-primary group" onClick={() => navigate('/auth')}>
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="btn-ghost" onClick={() => navigate('/community')}>
              Explore Community
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            {stats.map((stat, index) => (
              <div key={stat.label} className="glass-hover p-6 rounded-2xl text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full p-1">
            <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;