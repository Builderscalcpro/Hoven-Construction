import { useState, useEffect } from 'react';
import { businessInfoService, BusinessInfo } from '@/lib/businessInfoService';
import { useAuth } from '@/contexts/AuthContext';

export function useBusinessInfo() {
  const { user } = useAuth();
  const [businessInfos, setBusinessInfos] = useState<BusinessInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBusinessInfos();
    }
  }, [user]);

  const loadBusinessInfos = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const infos = await businessInfoService.getBusinessInfo(user.id);
      setBusinessInfos(infos);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading business info:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPrimaryBusinessInfo = (): BusinessInfo | null => {
    return businessInfos.length > 0 ? businessInfos[0] : null;
  };

  return {
    businessInfos,
    primaryBusinessInfo: getPrimaryBusinessInfo(),
    loading,
    error,
    refresh: loadBusinessInfos,
  };
}
