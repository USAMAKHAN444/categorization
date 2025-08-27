import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Vercel function called with method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body size:', req.body ? 'Has body' : 'No body');

  try {
    console.log('Attempting to connect to:', 'http://34.222.0.221/categorize');
    
    const response = await fetch('http://34.222.0.221/categorize', {
      method: 'POST',
      body: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`External server error ${response.status}:`, errorText);
      throw new Error(`External server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    
    if (error instanceof Error && error.message.includes('External server error')) {
      res.status(500).json({ 
        error: 'External server error',
        details: error.message
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to connect to external server',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
