import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import ImageUploader from './ImageUploader';
import { kitchens, bathrooms, adus, outdoor } from '@/data/portfolioData';
import { toast } from 'sonner';

interface PortfolioItem {
  id: number;
  title: string;
  location: string;
  image: string;
}

export default function PortfolioImageManager() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customImages, setCustomImages] = useState<Record<number, string>>({});

  useEffect(() => {
    loadCustomImages();
  }, []);

  const loadCustomImages = async () => {
    const { data, error } = await supabase
      .from('portfolio_images')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      const imageMap: Record<number, string> = {};
      data.forEach(img => {
        imageMap[img.portfolio_id] = img.image_url;
      });
      setCustomImages(imageMap);
    }
  };

  const handleImageUpdate = async (url: string) => {
    if (!selectedItem) return;

    const { error } = await supabase
      .from('portfolio_images')
      .upsert({
        portfolio_id: selectedItem.id,
        category: selectedCategory,
        title: selectedItem.title,
        location: selectedItem.location,
        image_url: url,
        updated_at: new Date().toISOString()
      }, { onConflict: 'portfolio_id' });

    if (error) {
      toast.error('Failed to save image');
    } else {
      toast.success('Image updated successfully!');
      setCustomImages(prev => ({ ...prev, [selectedItem.id]: url }));
      setSelectedItem(null);
    }
  };

  const renderGrid = (items: PortfolioItem[], category: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition">
          <img
            src={customImages[item.id] || item.image}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
          <CardContent className="p-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.location}</p>
            <Button
              size="sm"
              className="mt-2 w-full"
              onClick={() => {
                setSelectedItem(item);
                setSelectedCategory(category);
              }}
            >
              Replace Image
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Image Manager</CardTitle>
          <p className="text-sm text-gray-600">Upload custom images to replace portfolio items</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kitchens">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="kitchens">Kitchens ({kitchens.length})</TabsTrigger>
              <TabsTrigger value="bathrooms">Bathrooms ({bathrooms.length})</TabsTrigger>
              <TabsTrigger value="adus">ADUs ({adus.length})</TabsTrigger>
              <TabsTrigger value="outdoor">Outdoor ({outdoor.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="kitchens" className="mt-4">
              {renderGrid(kitchens, 'kitchens')}
            </TabsContent>
            <TabsContent value="bathrooms" className="mt-4">
              {renderGrid(bathrooms, 'bathrooms')}
            </TabsContent>
            <TabsContent value="adus" className="mt-4">
              {renderGrid(adus, 'adus')}
            </TabsContent>
            <TabsContent value="outdoor" className="mt-4">
              {renderGrid(outdoor, 'outdoor')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Replace Image: {selectedItem?.title}</DialogTitle>
            <p className="text-sm text-gray-600">Upload a new image for this portfolio item</p>
          </DialogHeader>
          <ImageUploader
            currentImage={customImages[selectedItem?.id || 0] || selectedItem?.image}
            onUploadComplete={handleImageUpdate}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
