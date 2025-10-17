import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { kitchens, bathrooms, adus, outdoor } from '@/data/portfolioData';

interface ImageSwapperProps {
  onSwapComplete: () => void;
}

export default function ImageSwapper({ onSwapComplete }: ImageSwapperProps) {
  const [category1, setCategory1] = useState('');
  const [item1, setItem1] = useState('');
  const [category2, setCategory2] = useState('');
  const [item2, setItem2] = useState('');

  const allCategories = { kitchens, bathrooms, adus, outdoor };
  const categories = Object.keys(allCategories);

  const getItems = (cat: string) => {
    return allCategories[cat as keyof typeof allCategories] || [];
  };

  const handleSwap = async () => {
    if (!item1 || !item2) {
      toast.error('Please select both items to swap');
      return;
    }

    const items1 = getItems(category1);
    const items2 = getItems(category2);
    const obj1 = items1.find(i => i.id.toString() === item1);
    const obj2 = items2.find(i => i.id.toString() === item2);

    if (!obj1 || !obj2) return;

    // Get current images from database
    const { data: img1 } = await supabase
      .from('portfolio_images')
      .select('image_url')
      .eq('portfolio_id', obj1.id)
      .single();

    const { data: img2 } = await supabase
      .from('portfolio_images')
      .select('image_url')
      .eq('portfolio_id', obj2.id)
      .single();

    const url1 = img1?.image_url || obj1.image;
    const url2 = img2?.image_url || obj2.image;

    // Swap images
    await supabase.from('portfolio_images').upsert({
      portfolio_id: obj1.id,
      category: category1,
      title: obj1.title,
      location: obj1.location,
      image_url: url2,
      updated_at: new Date().toISOString()
    }, { onConflict: 'portfolio_id' });

    await supabase.from('portfolio_images').upsert({
      portfolio_id: obj2.id,
      category: category2,
      title: obj2.title,
      location: obj2.location,
      image_url: url1,
      updated_at: new Date().toISOString()
    }, { onConflict: 'portfolio_id' });

    toast.success('Images swapped successfully!');
    onSwapComplete();
    setItem1('');
    setItem2('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap Images Between Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Select value={category1} onValueChange={setCategory1}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {category1 && (
              <Select value={item1} onValueChange={setItem1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {getItems(category1).map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.title} - {item.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {item1 && (
              <img
                src={getItems(category1).find(i => i.id.toString() === item1)?.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
            )}
          </div>

          <div className="space-y-3">
            <Select value={category2} onValueChange={setCategory2}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {category2 && (
              <Select value={item2} onValueChange={setItem2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {getItems(category2).map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.title} - {item.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {item2 && (
              <img
                src={getItems(category2).find(i => i.id.toString() === item2)?.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
            )}
          </div>
        </div>

        <Button onClick={handleSwap} disabled={!item1 || !item2} className="w-full">
          <ArrowLeftRight className="w-4 h-4 mr-2" />
          Swap Images
        </Button>
      </CardContent>
    </Card>
  );
}
