import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { googleCalendarService } from '@/lib/googleCalendarService';

export default function GoogleCalendarCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting to Google Calendar...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        throw new Error(`Authorization denied: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received from Google');
      }

      setMessage('Exchanging authorization code for tokens...');

      // Exchange code for tokens
      const tokens = await googleCalendarService.exchangeCode(code);
      
      if (!tokens.access_token || !tokens.refresh_token) {
        throw new Error('Invalid token response from Google');
      }

      setMessage('Saving tokens to database...');
      
      // Save tokens
      await googleCalendarService.saveTokens(tokens);

      setStatus('success');
      setMessage('Successfully connected to Google Calendar!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/calendar');
      }, 2000);
    } catch (error) {
      console.error('Calendar callback error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to connect to Google Calendar');
      
      // Log detailed error for debugging
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connecting...</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to consultations...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connection Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/consultations')}
              className="px-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition"
            >
              Back to Consultations
            </button>
          </>
        )}
      </div>
    </div>
  );
}
