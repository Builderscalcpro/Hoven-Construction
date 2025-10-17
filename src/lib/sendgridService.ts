import { supabase } from './supabase';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
  }>;
}

export interface EmailDeliveryStatus {
  id: string;
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  error?: string;
}

class SendGridService {
  private async callEdgeFunction(functionName: string, body: any) {
    const { data, error } = await supabase.functions.invoke(functionName, { body });
    
    if (error) throw error;
    return data;
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const result = await this.callEdgeFunction('send-email', options);
      
      // Log to sent_emails table
      await supabase.from('sent_emails').insert({
        recipient: Array.isArray(options.to) ? options.to[0] : options.to,
        subject: options.subject,
        status: 'sent',
        message_id: result.messageId,
        sent_at: new Date().toISOString()
      });

      return { success: true, messageId: result.messageId };
    } catch (error: any) {
      console.error('SendGrid error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendTemplateEmail(
    to: string | string[],
    templateId: string,
    dynamicData: Record<string, any>
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.sendEmail({
      to,
      subject: '', // Subject comes from template
      html: '',
      templateId,
      dynamicTemplateData: dynamicData
    });
  }

  async getDeliveryStatus(messageId: string): Promise<EmailDeliveryStatus | null> {
    const { data } = await supabase
      .from('sent_emails')
      .select('*')
      .eq('message_id', messageId)
      .single();
    
    return data;
  }

  async trackEmailOpen(messageId: string) {
    await supabase
      .from('sent_emails')
      .update({ 
        status: 'opened',
        opened_at: new Date().toISOString()
      })
      .eq('message_id', messageId);
  }

  async trackEmailClick(messageId: string) {
    await supabase
      .from('sent_emails')
      .update({ 
        clicked_at: new Date().toISOString()
      })
      .eq('message_id', messageId);
  }
}

export const sendgridService = new SendGridService();
