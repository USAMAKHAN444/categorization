export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Vercel function called - forwarding to backend');
    console.log('Content-Type:', req.headers['content-type']);
    
    const backendUrl = 'https://gb-ocr-stage.vertekx.com/categorize';
    
    // Forward the request with proper headers
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: req.body, // Use req.body instead of req
      headers: {
        'Content-Type': req.headers['content-type'] || 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ 
        error: 'Backend error', 
        status: response.status,
        details: errorText 
      });
    }

    const data = await response.json();
    console.log('Successfully forwarded request to backend');
    return res.json(data);
    
  } catch (error) {
    console.error('Vercel function error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
    
    return res.status(500).json({ 
      error: 'Vercel function failed', 
      details: error.message,
      type: error.constructor.name
    });
  }
}
