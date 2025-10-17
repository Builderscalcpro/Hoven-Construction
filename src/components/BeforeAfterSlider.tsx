import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Eye, EyeOff, RotateCcw, Maximize2 } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  onExpand?: () => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeAlt = 'Before renovation',
  afterAlt = 'After renovation',
  className = '',
  onExpand
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'toggle'>('slider');
  const [showBefore, setShowBefore] = useState(false);

  const handleSliderChange = (value: number[]) => {
    setSliderPosition(value[0]);
  };

  const toggleView = () => {
    setShowBefore(!showBefore);
  };

  const resetSlider = () => {
    setSliderPosition(50);
    setShowBefore(false);
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/90 backdrop-blur-sm hover:bg-white"
          onClick={() => setViewMode(viewMode === 'slider' ? 'toggle' : 'slider')}
        >
          {viewMode === 'slider' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/90 backdrop-blur-sm hover:bg-white"
          onClick={resetSlider}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        {onExpand && (
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={onExpand}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {viewMode === 'slider' ? (
        <>
          <div className="relative w-full aspect-video">
            <OptimizedImage
              src={afterImage}
              alt={afterAlt}
              width={1200}
              height={675}
              className="w-full h-full"
              objectFit="cover"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <OptimizedImage
                src={beforeImage}
                alt={beforeAlt}
                width={1200}
                height={675}
                className="w-full h-full"
                objectFit="cover"
              />
            </div>
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-gray-600" />
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-8 right-8">
            <Slider
              value={[sliderPosition]}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </>
      ) : (
        <div className="relative w-full aspect-video">
          <OptimizedImage
            src={showBefore ? beforeImage : afterImage}
            alt={showBefore ? beforeAlt : afterAlt}
            width={1200}
            height={675}
            className="w-full h-full transition-opacity duration-300"
            objectFit="cover"
          />
          <Button
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 hover:bg-emerald-700"
            onClick={toggleView}
          >
            {showBefore ? 'Show After' : 'Show Before'}
          </Button>
        </div>
      )}
    </div>
  );
};
