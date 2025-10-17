import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PortfolioItem {
  id: number;
  title: string;
  location: string;
  image: string;
  order?: number;
}

interface DraggablePortfolioGridProps {
  items: PortfolioItem[];
  category: string;
  customImages: Record<number, string>;
  onEdit: (item: PortfolioItem) => void;
  onReorder: () => void;
}

export default function DraggablePortfolioGrid({
  items,
  category,
  customImages,
  onEdit,
  onReorder
}: DraggablePortfolioGridProps) {
  const [orderedItems, setOrderedItems] = useState(items);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...orderedItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setOrderedItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    
    // Save new order to database
    const updates = orderedItems.map((item, index) => ({
      portfolio_id: item.id,
      category,
      title: item.title,
      location: item.location,
      image_url: customImages[item.id] || item.image,
      display_order: index,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('portfolio_images')
      .upsert(updates, { onConflict: 'portfolio_id' });

    if (error) {
      toast.error('Failed to save order');
    } else {
      toast.success('Order saved successfully!');
      onReorder();
    }
  };

  const handleDelete = async (item: PortfolioItem) => {
    if (!confirm(`Delete ${item.title}?`)) return;

    const { error } = await supabase
      .from('portfolio_images')
      .delete()
      .eq('portfolio_id', item.id);

    if (!error) {
      toast.success('Image deleted');
      onReorder();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orderedItems.map((item, index) => (
        <Card
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`overflow-hidden cursor-move transition ${
            draggedIndex === index ? 'opacity-50' : 'hover:shadow-lg'
          }`}
        >
          <div className="relative">
            <img
              src={customImages[item.id] || item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 bg-white rounded p-1">
              <GripVertical className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{item.location}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(item)} className="flex-1">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(item)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
