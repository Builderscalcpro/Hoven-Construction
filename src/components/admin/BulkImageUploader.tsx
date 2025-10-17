import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface BulkImageUploaderProps {
  category: string;
  onComplete: () => void;
}

export default function BulkImageUploader({ category, onComplete }: BulkImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    setUploading(true);
    setProgress(0);
    setUploadedCount(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'portfolio_images');

      try {
        const response = await supabase.functions.invoke('upload-to-cloudinary', {
          body: { file: await fileToBase64(file) }
        });

        if (response.data?.url) {
          setUploadedCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }

      setProgress(((i + 1) / files.length) * 100);
    }

    setUploading(false);
    toast.success(`${uploadedCount} images uploaded successfully!`);
    onComplete();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="mb-2">Drag & drop images here</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="bulk-upload"
          />
          <label htmlFor="bulk-upload">
            <Button variant="outline" as="span">Select Files</Button>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium">{files.length} files selected</p>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <Button size="sm" variant="ghost" onClick={() => removeFile(i)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center">{uploadedCount} of {files.length} uploaded</p>
          </div>
        )}

        <Button onClick={uploadAll} disabled={files.length === 0 || uploading} className="w-full">
          {uploading ? 'Uploading...' : `Upload ${files.length} Images`}
        </Button>
      </CardContent>
    </Card>
  );
}
