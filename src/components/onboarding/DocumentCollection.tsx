import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DocumentCollection({ contractorId, onboardingId }: any) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const requiredDocs = [
    { type: 'w9', label: 'W-9 Form', required: true },
    { type: 'drivers_license', label: "Driver's License", required: true },
    { type: 'insurance_certificate', label: 'Insurance Certificate', required: true },
    { type: 'business_license', label: 'Business License', required: false },
    { type: 'certifications', label: 'Professional Certifications', required: false }
  ];

  useEffect(() => {
    fetchDocuments();
  }, [contractorId]);

  const fetchDocuments = async () => {
    const { data } = await supabase
      .from('contractor_documents')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false });
    
    setDocuments(data || []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const filePath = `${contractorId}/${docType}_${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('onboarding-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('contractor_documents')
        .insert({
          contractor_id: contractorId,
          onboarding_id: onboardingId,
          document_type: docType,
          file_path: filePath,
          file_name: file.name,
          status: 'pending'
        });

      if (dbError) throw dbError;

      toast({ title: 'Document uploaded successfully' });
      fetchDocuments();
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const getDocStatus = (docType: string) => {
    return documents.find(d => d.document_type === docType);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Collection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requiredDocs.map((doc) => {
          const uploaded = getDocStatus(doc.type);
          
          return (
            <div key={doc.type} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">{doc.label}</span>
                  {doc.required && <Badge variant="secondary">Required</Badge>}
                </div>
                {uploaded && (
                  <Badge variant={uploaded.status === 'approved' ? 'default' : 'secondary'}>
                    {uploaded.status === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {uploaded.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                    {uploaded.status}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  id={`file-${doc.type}`}
                  className="hidden"
                  onChange={(e) => handleUpload(e, doc.type)}
                  disabled={uploading}
                />
                <Label htmlFor={`file-${doc.type}`} className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploaded ? 'Replace' : 'Upload'}
                  </Button>
                </Label>
                {uploaded && (
                  <span className="text-sm text-muted-foreground">{uploaded.file_name}</span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
