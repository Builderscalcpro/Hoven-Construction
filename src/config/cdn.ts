// Image CDN Configuration
// Supports Cloudinary, Imgix, ImageKit, and custom CDN providers

export type CDNProvider = 'cloudinary' | 'imgix' | 'imagekit' | 'custom' | 'none';

interface CDNConfig {
  provider: CDNProvider;
  cloudName?: string; // For Cloudinary
  domain?: string; // For Imgix/ImageKit/Custom
  baseUrl?: string; // For custom CDN
  defaultQuality?: number;
  autoFormat?: boolean;
  enableWebP?: boolean;
}

// Load from environment variables or use defaults
const getEnvConfig = (): CDNConfig => {
  const provider = (import.meta.env.VITE_CDN_PROVIDER as CDNProvider) || 'none';
  
  return {
    provider,
    cloudName: import.meta.env.VITE_CDN_CLOUD_NAME || 'your-cloud-name',
    domain: import.meta.env.VITE_CDN_DOMAIN,
    baseUrl: import.meta.env.VITE_CDN_BASE_URL,
    defaultQuality: parseInt(import.meta.env.VITE_CDN_DEFAULT_QUALITY || '85'),
    autoFormat: true,
    enableWebP: true
  };
};

// Configure your CDN provider here or via environment variables
export const cdnConfig: CDNConfig = getEnvConfig();

export const isCDNEnabled = (): boolean => {
  return cdnConfig.provider !== 'none';
};

// Quick setup examples (uncomment and configure):

// Cloudinary
// export const cdnConfig: CDNConfig = {
//   provider: 'cloudinary',
//   cloudName: 'your-cloud-name',
//   defaultQuality: 85,
//   autoFormat: true,
//   enableWebP: true
// };

// Imgix
// export const cdnConfig: CDNConfig = {
//   provider: 'imgix',
//   domain: 'your-domain.imgix.net',
//   defaultQuality: 85,
//   autoFormat: true,
//   enableWebP: true
// };

// ImageKit
// export const cdnConfig: CDNConfig = {
//   provider: 'imagekit',
//   domain: 'ik.imagekit.io/your-id',
//   defaultQuality: 85,
//   autoFormat: true,
//   enableWebP: true
// };

// Custom CDN
// export const cdnConfig: CDNConfig = {
//   provider: 'custom',
//   baseUrl: 'https://cdn.example.com',
//   defaultQuality: 85,
//   autoFormat: true,
//   enableWebP: true
// };
