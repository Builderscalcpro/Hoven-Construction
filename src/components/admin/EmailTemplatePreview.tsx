import { Card } from '@/components/ui/card';

interface EmailTemplatePreviewProps {
  template: {
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
    background_color: string;
    subject_line: string;
    email_body: string;
  };
  sampleData?: {
    date?: string;
    time?: string;
    service?: string;
    clientName?: string;
  };
}

export function EmailTemplatePreview({ template, sampleData = {} }: EmailTemplatePreviewProps) {
  const replaceVariables = (text: string) => {
    return text
      .replace(/{{date}}/g, sampleData.date || 'January 15, 2025')
      .replace(/{{time}}/g, sampleData.time || '2:00 PM')
      .replace(/{{service}}/g, sampleData.service || 'Kitchen Remodeling Consultation')
      .replace(/{{clientName}}/g, sampleData.clientName || 'John Doe');
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Email Preview</h3>
      <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: template.background_color }}>
        {template.logo_url && (
          <div className="p-6 text-center" style={{ backgroundColor: template.primary_color }}>
            <img src={template.logo_url} alt="Logo" className="h-16 mx-auto" />
          </div>
        )}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div 
              dangerouslySetInnerHTML={{ __html: replaceVariables(template.email_body) }}
              style={{ color: '#333' }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
