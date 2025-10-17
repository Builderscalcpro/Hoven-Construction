import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, Trash2, Eye, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  title: string;
  document_type: string;
  file_url: string;
  file_size: number;
  status: string;
  created_at: string;
  expiry_date?: string;
}

export default function DocumentManager({ contractorId }: { contractorId: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (contractorId) fetchDocuments();
  }, [contractorId]);

  const fetchDocuments = async () => {
    const { data } = await supabase
      .from('contractor_documents')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false });

    setDocuments(data || []);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedType) {
      toast({
        title: 'Error',
        description: 'Please select a document type and file.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileName = `${contractorId}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('contractor-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('contractor-documents')
        .getPublicUrl(fileName);

      await supabase.from('contractor_documents').insert({
        contractor_id: contractorId,
        title: file.name,
        document_type: selectedType,
        file_url: publicUrl,
        file_size: file.size,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id,
      });

      toast({
        title: 'Document Uploaded',
        description: 'Your document has been uploaded successfully.',
      });

      fetchDocuments();
      setSelectedType('');
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (docId: string, fileUrl: string) => {
    try {
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('contractor-documents')
          .remove([`${contractorId}/${fileName}`]);
      }

      await supabase
        .from('contractor_documents')
        .delete()
        .eq('id', docId);

      toast({
        title: 'Document Deleted',
        description: 'Document has been removed successfully.',
      });

      fetchDocuments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete document.',
        variant: 'destructive',
      });
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      contract: 'bg-blue-100 text-blue-800',
      invoice: 'bg-green-100 text-green-800',
      permit: 'bg-purple-100 text-purple-800',
      insurance: 'bg-orange-100 text-orange-800',
      license: 'bg-red-100 text-red-800',
      safety: 'bg-yellow-100 text-yellow-800',
      blueprint: 'bg-indigo-100 text-indigo-800',
      report: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / 1048576) + ' MB';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Document Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="permit">Permit</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="license">License</SelectItem>
                    <SelectItem value="safety">Safety Document</SelectItem>
                    <SelectItem value="blueprint">Blueprint</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select File</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={!selectedType || uploading}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  />
                  {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getTypeColor(doc.document_type)}>
                        {doc.document_type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatFileSize(doc.file_size)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={doc.file_url} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline"
                    onClick={() => deleteDocument(doc.id, doc.file_url)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {documents.length === 0 && (
              <p className="text-center text-gray-500 py-8">No documents uploaded yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}