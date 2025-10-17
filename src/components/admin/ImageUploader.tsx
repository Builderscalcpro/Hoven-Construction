import { useState, useRef } from 'react';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
}

export default function ImageUploader({ onUploadComplete, currentImage }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await uploadImage(file);
    } else {
      toast.error('Please drop a valid image file');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      const base64 = await fileToBase64(file);
      
      const { data, error } = await supabase.functions.invoke('upload-to-cloudinary', {
        body: { image: base64, folder: 'portfolio' }
      });

      if (error) throw error;
      
      if (data?.url) {
        setUploadSuccess(true);
        toast.success('Image uploaded successfully!');
        onUploadComplete(data.url);
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed. Please try again.');
      setPreview('');
    } finally {
      setIsUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const clearPreview = () => {
    setPreview('');
    setUploadSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !preview && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 hover:border-gray-400'
        } ${preview ? 'cursor-default' : ''}`}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-80 mx-auto rounded-lg shadow-lg" />
            {uploadSuccess && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Uploaded</span>
              </div>
            )}
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-16 w-16 mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium">Drag & drop image here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, WEBP (max 10MB)</p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      
      {!preview && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Select Image
            </>
          )}
        </Button>
      )}
    </div>
  );
}
