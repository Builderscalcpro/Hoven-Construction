import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { invoiceData } = await req.json();
    
    if (!invoiceData) {
      return new Response(JSON.stringify({ error: 'Invoice data required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate HTML invoice
    const html = `
      <!DOCTYPE html>
      <html>
        <head><style>body{font-family:Arial;padding:20px;}h1{color:#333;}</style></head>
        <body>
          <h1>Invoice #${invoiceData.invoiceNumber}</h1>
          <p>Date: ${invoiceData.date}</p>
          <p>Customer: ${invoiceData.customerName}</p>
          <hr>
          <h3>Items:</h3>
          ${invoiceData.items.map(item => `<p>${item.description}: $${item.amount}</p>`).join('')}
          <hr>
          <h2>Total: $${invoiceData.total}</h2>
        </body>
      </html>
    `;

    // In production, you would use a PDF generation library
    // For now, return HTML that can be printed to PDF
    return new Response(JSON.stringify({ 
      html,
      pdfUrl: 'data:text/html;base64,' + btoa(html)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Generate invoice PDF error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
