import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Zap,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
  Heart
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can send the email to your backend or show a message
    setSubmitted(true);
    // Optionally clear the input
    setEmail('');
  };
  const footerLinks = {
    Platform: [
      { name: 'Home', href: '/' },
      { name: 'Trending', href: '/trending' },
      { name: 'Community', href: '/community' },
      { name: 'Quick News', href: '/quick-news' },
    ],
    Features: [
      { name: 'Tech Memes', href: '/memes' },
      { name: 'Discussions', href: '/discussions' },
      { name: 'User Profiles', href: '/profiles' },
      { name: 'Search', href: '/search' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Contact', href: '/contact' },
    ],
    Resources: [
      { name: 'Help Center', href: '/help' },
      { name: 'Documentation', href: '/docs' },
      { name: 'API', href: '/api' },
      { name: 'Status', href: '/status' },
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/soumen0818' },
    { name: 'Twitter', icon: Twitter, href: 'https://x.com/SoumenDas334584' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/soumen-das-76b867218/' },
    { name: 'Email', icon: Mail, href: 'dassoumen0818@gmail.com' },
  ];

  return (
    <footer className="bg-card/50 border-t border-border/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>TechVerse</h3>
                  <p className="text-sm text-muted-foreground font-mono">Connect</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your ultimate destination for technology news, insights, and community discussions.
                Stay connected with the pulse of innovation.
              </p>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Stay Updated</h4>
                <form className="flex space-x-2" onSubmit={handleNewsletterSubmit}>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-muted/50 border-border/30"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <Button className="btn-primary px-4" type="submit" disabled={submitted && !email}>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  {submitted ? 'Thank you for subscribing!' : 'Get weekly tech insights delivered to your inbox.'}
                </p>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(footerLinks).map(([category, links]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-foreground mb-4">{category}</h4>
                    <ul className="space-y-3">
                      {links.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.href}
                            className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border/20">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© 2025 TechVerse Connect || </span>

              <span>For the tech community.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="w-4 h-4" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;