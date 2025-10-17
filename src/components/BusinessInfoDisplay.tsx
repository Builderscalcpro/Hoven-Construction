import { useBusinessInfo } from '@/hooks/useBusinessInfo';
import { MapPin, Phone, Globe, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface BusinessInfoDisplayProps {
  showHours?: boolean;
  className?: string;
}

export default function BusinessInfoDisplay({ showHours = false, className = '' }: BusinessInfoDisplayProps) {
  const { primaryBusinessInfo, loading } = useBusinessInfo();

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  if (!primaryBusinessInfo) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {primaryBusinessInfo.address && (
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <span className="text-sm">{primaryBusinessInfo.address}</span>
        </div>
      )}
      
      {primaryBusinessInfo.phone && (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${primaryBusinessInfo.phone}`} className="text-sm hover:underline">
            {primaryBusinessInfo.phone}
          </a>
        </div>
      )}
      
      {primaryBusinessInfo.website && (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <a 
            href={primaryBusinessInfo.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            Visit Website
          </a>
        </div>
      )}

      {showHours && primaryBusinessInfo.business_hours && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Business Hours</span>
          </div>
          <div className="text-sm text-muted-foreground pl-6">
            {/* Display business hours if available */}
            <p>See Google Business Profile for hours</p>
          </div>
        </div>
      )}
    </div>
  );
}
