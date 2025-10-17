// Image CDN optimization with URL-based transformations
import { cdnConfig, isCDNEnabled } from '@/config/cdn';

export const isWebPSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

export const generateBlurPlaceholder = (width: number = 20, height: number = 20): string => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='${width}' height='${height}' fill='%23e5e7eb' filter='url(%23b)'/%3E%3C/svg%3E`;
};

// CDN URL builders for different providers
const buildCloudinaryUrl = (url: string, width?: number, format?: string, quality?: number): string => {
  const { cloudName, defaultQuality } = cdnConfig;
  const q = quality || defaultQuality || 85;
  const f = format || 'auto';
  const w = width || 'auto';
  
  // Extract filename from URL
  const filename = url.split('/').pop() || 'image.jpg';
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${w},f_${f},q_${q}/${filename}`;
};

const buildImgixUrl = (url: string, width?: number, format?: string, quality?: number): string => {
  const { domain, defaultQuality } = cdnConfig;
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (format) params.append('fm', format);
  params.append('q', (quality || defaultQuality || 85).toString());
  params.append('auto', 'format,compress');
  
  const filename = url.split('/').pop() || 'image.jpg';
  return `https://${domain}/${filename}?${params.toString()}`;
};

const buildImageKitUrl = (url: string, width?: number, format?: string, quality?: number): string => {
  const { domain, defaultQuality } = cdnConfig;
  const transformations = [];
  if (width) transformations.push(`w-${width}`);
  if (format) transformations.push(`f-${format}`);
  transformations.push(`q-${quality || defaultQuality || 85}`);
  
  const filename = url.split('/').pop() || 'image.jpg';
  return `https://${domain}/tr:${transformations.join(',')}/${filename}`;
};

const buildCustomCDNUrl = (url: string, width?: number, format?: string, quality?: number): string => {
  const { baseUrl, defaultQuality } = cdnConfig;
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (format) params.append('format', format);
  params.append('quality', (quality || defaultQuality || 85).toString());
  
  const filename = url.split('/').pop() || 'image.jpg';
  return `${baseUrl}/${filename}?${params.toString()}`;
};

export const getOptimizedImageUrl = (
  url: string, 
  width?: number, 
  format: 'webp' | 'jpeg' | 'png' | 'auto' = 'auto',
  quality?: number
): string => {
  // Skip data URLs and already optimized URLs
  if (url.includes('data:image') || url.includes('blob:')) return url;
  
  // If CDN is not enabled, return original URL
  if (!isCDNEnabled()) {
    return url;
  }
  
  // Build CDN URL based on provider
  switch (cdnConfig.provider) {
    case 'cloudinary':
      return buildCloudinaryUrl(url, width, format, quality);
    case 'imgix':
      return buildImgixUrl(url, width, format, quality);
    case 'imagekit':
      return buildImageKitUrl(url, width, format, quality);
    case 'custom':
      return buildCustomCDNUrl(url, width, format, quality);
    default:
      return url;
  }
};

export const generateSrcSet = (url: string, widths: number[] = [320, 640, 768, 1024, 1280, 1536]): string => {
  return widths
    .map(w => `${getOptimizedImageUrl(url, w)} ${w}w`)
    .join(', ');
};

export const generateSizes = (maxWidth?: number): string => {
  if (maxWidth) {
    return `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`;
  }
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
};
