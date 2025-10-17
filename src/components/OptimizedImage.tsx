import React, { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { 
  getOptimizedImageUrl, 
  generateBlurPlaceholder, 
  generateSrcSet, 
  generateSizes,
  isWebPSupported 
} from '@/utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: string;
  sizes?: string;
  srcSetWidths?: number[];
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  quality = 85,
  priority = false,
  objectFit = 'cover',
  aspectRatio,
  sizes,
  srcSetWidths = [320, 640, 768, 1024, 1280, 1536]
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  const shouldLoad = priority || hasIntersected;
  const blurPlaceholder = generateBlurPlaceholder(width, height);
  const webpSrc = getOptimizedImageUrl(src, width, 'webp');
  const jpegSrc = getOptimizedImageUrl(src, width, 'jpeg');
  const srcSet = generateSrcSet(src, srcSetWidths);
  const sizesAttr = sizes || generateSizes(width);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  return (
    <div 
      ref={targetRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined) }}
    >
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <img
          src={blurPlaceholder}
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{ objectFit, filter: 'blur(20px)', transform: 'scale(1.1)' }}
          aria-hidden="true"
        />
      )}
      
      {/* Main image with WebP and fallback */}
      {shouldLoad && !hasError && (
        <picture>
          <source type="image/webp" srcSet={srcSet} sizes={sizesAttr} />
          <source type="image/jpeg" srcSet={generateSrcSet(jpegSrc, srcSetWidths)} sizes={sizesAttr} />
          <img
            src={jpegSrc}
            alt={alt}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ objectFit }}
            decoding="async"
          />
        </picture>
      )}
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
};
