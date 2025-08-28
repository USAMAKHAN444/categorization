export default async function handler(req, res) {
  try {
    console.log('Ping endpoint called');
    
    // Test basic fetch
    const response = await fetch('https://gb-ocr-stage.vertekx.com/health');
    
    if (response.ok) {
      const data = await response.text();
      console.log('Successfully connected to backend:', data);
      res.json({ 
        status: 'success', 
        message: 'Can reach backend server',
        backendResponse: data
      });
    } else {
      console.log('Backend responded with error:', response.status);
      res.json({ 
        status: 'error', 
        message: `Backend error: ${response.status}`,
        statusText: response.statusText
      });
    }
  } catch (error) {
    console.error('Ping failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to ping backend',
      error: error.message,
      stack: error.stack
    });
  }
}
