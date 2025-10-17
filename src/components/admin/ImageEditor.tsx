import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Crop, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedUrl: string) => void;
  onCancel: () => void;
}

export default function ImageEditor({ imageUrl, onSave, onCancel }: ImageEditorProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyEdits = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `brightness(${brightness}%)`;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          onSave(url);
        }
      });
    };
    img.src = imageUrl;
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
        <img
          src={imageUrl}
          alt="Edit"
          className="w-full h-full object-contain"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            filter: `brightness(${brightness}%)`,
            transition: 'all 0.2s'
          }}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium flex items-center gap-2">
            <ZoomIn className="w-4 h-4" /> Zoom: {zoom.toFixed(1)}x
          </label>
          <Slider value={[zoom]} onValueChange={([v]) => setZoom(v)} min={0.5} max={3} step={0.1} />
        </div>

        <div>
          <label className="text-sm font-medium flex items-center gap-2">
            <RotateCw className="w-4 h-4" /> Rotation: {rotation}°
          </label>
          <Slider value={[rotation]} onValueChange={([v]) => setRotation(v)} min={0} max={360} step={15} />
        </div>

        <div>
          <label className="text-sm font-medium">Brightness: {brightness}%</label>
          <Slider value={[brightness]} onValueChange={([v]) => setBrightness(v)} min={50} max={150} step={5} />
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2">
        <Button onClick={applyEdits} className="flex-1">Save Changes</Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">Cancel</Button>
      </div>
    </Card>
  );
}
