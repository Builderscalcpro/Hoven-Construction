import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { kitchens, bathrooms, adus, outdoor } from '@/data/portfolioData';
import DraggablePortfolioGrid from '@/components/admin/DraggablePortfolioGrid';
import ImageEditor from '@/components/admin/ImageEditor';
import BulkImageUploader from '@/components/admin/BulkImageUploader';
import ImageSwapper from '@/components/admin/ImageSwapper';
import ImageUploader from '@/components/admin/ImageUploader';
import PortfolioSEO from '@/components/PortfolioSEO';
import { Upload, ArrowLeftRight, Edit, Grid3x3 } from 'lucide-react';


interface PortfolioItem {
  id: number;
  title: string;
  location: string;
  image: string;
}

export default function AdvancedPortfolioManager() {
  const [customImages, setCustomImages] = useState<Record<number, string>>({});
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('kitchens');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showSwapper, setShowSwapper] = useState(false);


  useEffect(() => {
    loadCustomImages();
  }, []);

  const loadCustomImages = async () => {
    const { data, error } = await supabase
      .from('portfolio_images')
      .select('*')
      .order('display_order', { ascending: true });

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

    if (!error) {
      setCustomImages(prev => ({ ...prev, [selectedItem.id]: url }));
      setSelectedItem(null);
      setEditingImage(null);
    }
  };

  const renderTabContent = (items: PortfolioItem[], category: string) => (
    <DraggablePortfolioGrid
      items={items}
      category={category}
      customImages={customImages}
      onEdit={(item) => {
        setSelectedItem(item);
        setSelectedCategory(category);
      }}
      onReorder={loadCustomImages}
    />
  );

  const getCategoryData = () => {
    const categoryMap = { kitchens, bathrooms, adus, outdoor };
    return categoryMap[selectedCategory as keyof typeof categoryMap] || kitchens;
  };

  return (
    <>
      <PortfolioSEO category={selectedCategory as any} projects={getCategoryData()} />
      <div className="container mx-auto p-6 space-y-6">

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Advanced Portfolio Manager</span>
            <div className="flex gap-2">
              <Button onClick={() => setShowBulkUpload(true)} variant="outline">
                <Upload className="w-4 h-4 mr-2" /> Bulk Upload
              </Button>
              <Button onClick={() => setShowSwapper(true)} variant="outline">
                <ArrowLeftRight className="w-4 h-4 mr-2" /> Swap Images
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kitchens" onValueChange={(value) => setSelectedCategory(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="kitchens">Kitchens ({kitchens.length})</TabsTrigger>
              <TabsTrigger value="bathrooms">Bathrooms ({bathrooms.length})</TabsTrigger>
              <TabsTrigger value="adus">ADUs ({adus.length})</TabsTrigger>
              <TabsTrigger value="outdoor">Outdoor ({outdoor.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="kitchens" className="mt-6">
              {renderTabContent(kitchens, 'kitchens')}
            </TabsContent>
            <TabsContent value="bathrooms" className="mt-6">
              {renderTabContent(bathrooms, 'bathrooms')}
            </TabsContent>
            <TabsContent value="adus" className="mt-6">
              {renderTabContent(adus, 'adus')}
            </TabsContent>
            <TabsContent value="outdoor" className="mt-6">
              {renderTabContent(outdoor, 'outdoor')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selectedItem && !editingImage} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit: {selectedItem?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageUploader
              currentImage={customImages[selectedItem?.id || 0] || selectedItem?.image}
              onUploadComplete={handleImageUpdate}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setEditingImage(customImages[selectedItem?.id || 0] || selectedItem?.image || '')}
            >
              <Edit className="w-4 h-4 mr-2" /> Advanced Editing
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          {editingImage && (
            <ImageEditor
              imageUrl={editingImage}
              onSave={handleImageUpdate}
              onCancel={() => setEditingImage(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Upload Images</DialogTitle>
          </DialogHeader>
          <BulkImageUploader
            category={selectedCategory}
            onComplete={() => {
              setShowBulkUpload(false);
              loadCustomImages();
            }}
          />
        </DialogContent>
      </Dialog>


      <Dialog open={showSwapper} onOpenChange={setShowSwapper}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Swap Images Between Projects</DialogTitle>
          </DialogHeader>
          <ImageSwapper onSwapComplete={() => {
            setShowSwapper(false);
            loadCustomImages();
          }} />
        </DialogContent>
      </Dialog>

      </div>
    </>
  );
}

