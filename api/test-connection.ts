import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req, res) {
  try {
    console.log('Testing connection to backend server...');
    
    // Test 1: Basic connectivity
    console.log('Attempting to connect to: https://gb-ocr-stage.vertekx.com/health');
    
    const response = await fetch('https://gb-ocr-stage.vertekx.com/health', {
      method: 'GET',
      timeout: 10000, // 10 second timeout
    });

    if (response.ok) {
      const data = await response.text();
      console.log('✅ SUCCESS: Can reach backend server');
      console.log('Response:', data);
      
      res.json({ 
        status: 'success', 
        message: 'Can reach backend server',
        backendResponse: data,
        responseStatus: response.status,
        responseHeaders: Object.fromEntries(response.headers.entries())
      });
    } else {
      console.log('❌ Backend responded with error:', response.status);
      res.json({ 
        status: 'error', 
        message: `Backend error: ${response.status}`,
        statusText: response.statusText
      });
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to connect to backend',
      error: error.message,
      errorType: error.constructor.name,
      timestamp: new Date().toISOString()
    });
  }
}
