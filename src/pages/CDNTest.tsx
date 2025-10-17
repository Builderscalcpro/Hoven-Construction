import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getOptimizedImageUrl } from '@/utils/imageOptimization';
import { cdnConfig, isCDNEnabled } from '@/config/cdn';
import { CheckCircle2, XCircle, Clock, Image as ImageIcon } from 'lucide-react';

interface ImageTest {
  name: string;
  originalUrl: string;
  optimizedUrl: string;
  width?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'auto';
}

interface ImageStats {
  loadTime: number;
  size?: number;
}

export default function CDNTest() {
  const [imageStats, setImageStats] = useState<Record<string, ImageStats>>({});
  const [loading, setLoading] = useState(false);

  const testImages: ImageTest[] = [
    {
      name: 'Original Quality',
      originalUrl: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760105705375_a3a2215f.webp',
      optimizedUrl: getOptimizedImageUrl('kitchen-1.jpg', undefined, 'auto', 100),
    },
    {
      name: 'Optimized (85% Quality)',
      originalUrl: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760105707157_35e4199b.webp',
      optimizedUrl: getOptimizedImageUrl('kitchen-2.jpg', undefined, 'auto', 85),
    },
    {
      name: 'Compressed (60% Quality)',
      originalUrl: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760105708990_93af9a14.webp',
      optimizedUrl: getOptimizedImageUrl('kitchen-3.jpg', undefined, 'auto', 60),
    },
  ];

  const measureImageLoad = (url: string, key: string) => {
    const startTime = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      setImageStats(prev => ({
        ...prev,
        [key]: { loadTime }
      }));
    };
    
    img.src = url;
  };

  const runTests = () => {
    setLoading(true);
    setImageStats({});
    
    testImages.forEach((test, index) => {
      measureImageLoad(test.originalUrl, `original-${index}`);
      if (isCDNEnabled()) {
        measureImageLoad(test.optimizedUrl, `optimized-${index}`);
      }
    });
    
    setTimeout(() => setLoading(false), 3000);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CDN Configuration Test
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Verify Cloudinary CDN optimization is working correctly
          </p>
          
          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isCDNEnabled() ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                CDN Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="font-semibold">Provider:</span>
                <Badge variant={isCDNEnabled() ? 'default' : 'secondary'}>
                  {cdnConfig.provider}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Cloud Name:</span>
                <span className="text-sm text-gray-600">{cdnConfig.cloudName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Default Quality:</span>
                <span className="text-sm text-gray-600">{cdnConfig.defaultQuality}%</span>
              </div>
            </CardContent>
          </Card>

          <Button onClick={runTests} disabled={loading} size="lg">
            {loading ? 'Testing...' : 'Run Tests Again'}
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testImages.map((test, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">{test.name}</CardTitle>
                <CardDescription>
                  Quality: {test.quality || cdnConfig.defaultQuality}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={test.originalUrl}
                    alt={test.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Load Time
                    </span>
                    <span className="font-semibold">
                      {imageStats[`original-${index}`]?.loadTime 
                        ? `${imageStats[`original-${index}`].loadTime.toFixed(0)}ms`
                        : 'Testing...'}
                    </span>
                  </div>
                  
                  {isCDNEnabled() && (
                    <div className="p-2 bg-green-50 rounded">
                      <div className="font-semibold text-green-700 mb-1">CDN URL:</div>
                      <code className="text-xs break-all">{test.optimizedUrl}</code>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>
              Compare load times across different quality settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {testImages.map((test, index) => {
                const stats = imageStats[`original-${index}`];
                return (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {stats?.loadTime ? `${stats.loadTime.toFixed(0)}ms` : '—'}
                    </div>
                    <div className="text-sm text-gray-600">{test.name}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
