export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const backendUrl = 'https://gb-ocr-stage.vertekx.com/categorize';
    const headers = {};
    if (typeof req.headers['content-type'] === 'string') {
      headers['content-type'] = req.headers['content-type'];
    }

    const response = await fetch(backendUrl, {
      method: 'POST',
      body: req,
      headers,
    });

    const text = await response.text();
    res.status(response.status);
    res.setHeader('content-type', response.headers.get('content-type') || 'application/json');
    return res.send(text);
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return res.status(500).json({ error: 'Proxy failure', details: error?.message || 'Unknown error' });
  }
}
