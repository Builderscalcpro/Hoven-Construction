import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface BlogImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
}

export function BlogImageUpload({ currentImage, onImageUploaded }: BlogImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
      
      setPreview(data.publicUrl);
      onImageUploaded(data.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {preview && (
        <div className="relative mb-4">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
          <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setPreview(undefined)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <label className="cursor-pointer">
        <Button disabled={uploading} asChild>
          <span><Upload className="mr-2 h-4 w-4" />{uploading ? 'Uploading...' : 'Upload Image'}</span>
        </Button>
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </label>
    </div>
  );
}
