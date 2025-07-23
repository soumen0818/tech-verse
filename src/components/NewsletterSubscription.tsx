import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const subscribeNewsletter = async (email: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: data.message || "Successfully subscribed to newsletter",
        });
        return true;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe to newsletter",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    const success = await subscribeNewsletter(email.trim());

    if (success) {
      setEmail('');
    }

    setIsSubscribing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="bg-background border-border"
        required
      />
      <Button
        type="submit"
        className="btn-primary"
        disabled={isSubscribing || !email.trim()}
      >
        <Mail className="w-4 h-4 mr-2" />
        {isSubscribing ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
};

export default NewsletterSubscription;