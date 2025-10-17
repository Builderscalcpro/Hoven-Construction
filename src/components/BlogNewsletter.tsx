import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from './ui/use-toast';

export default function BlogNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our latest construction tips and guides.",
      });
      setEmail('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <Mail className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Get Expert Construction Tips
        </h3>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for renovation guides, cost-saving tips, and exclusive insights from industry experts.
        </p>
        
        {!subscribed ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              Subscribe
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Thanks for subscribing!</span>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-4">
          Join 5,000+ homeowners getting weekly renovation tips
        </p>
      </div>
    </div>
  );
}
