import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Testing connection to external server...');
    
    const response = await fetch('http://34.222.0.221/health', {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.text();
      console.log('Connection successful:', data);
      res.json({ 
        status: 'success', 
        message: 'Can reach external server',
        response: data 
      });
    } else {
      console.log('Connection failed with status:', response.status);
      res.json({ 
        status: 'error', 
        message: `HTTP ${response.status}`,
        statusText: response.statusText
      });
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to connect',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
