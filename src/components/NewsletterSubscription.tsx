import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Mail } from 'lucide-react';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { subscribeNewsletter } = useSupabaseData();

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