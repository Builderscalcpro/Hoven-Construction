import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { kitchens, bathrooms, adus, outdoor } from '@/data/portfolioData';

interface PortfolioItem {
  id: number;
  title: string;
  location: string;
  image: string;
}

interface CustomImage {
  portfolio_id: number;
  image_url: string;
  display_order?: number;
}

export function usePortfolioData() {
  const [customImages, setCustomImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomImages();
  }, []);

  const loadCustomImages = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_images')
        .select('portfolio_id, image_url, display_order')
        .order('display_order', { ascending: true });

      if (!error && data) {
        const imageMap: Record<number, string> = {};
        data.forEach((img: CustomImage) => {
          imageMap[img.portfolio_id] = img.image_url;
        });
        setCustomImages(imageMap);
      }
    } catch (error) {
      console.error('Error loading custom images:', error);
    } finally {
      setLoading(false);
    }
  };

  const mergeWithCustomImages = (items: PortfolioItem[]) => {
    return items.map(item => ({
      ...item,
      image: customImages[item.id] || item.image
    }));
  };

  return {
    kitchens: mergeWithCustomImages(kitchens),
    bathrooms: mergeWithCustomImages(bathrooms),
    adus: mergeWithCustomImages(adus),
    outdoor: mergeWithCustomImages(outdoor),
    loading,
    refresh: loadCustomImages
  };
}
