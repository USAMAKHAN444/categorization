import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the original multipart/form-data stream as-is to the FastAPI server
    const backendUrl = 'https://gb-ocr-stage.vertekx.com/categorize';

    const forwardHeaders: Record<string, string> = {};
    if (typeof req.headers['content-type'] === 'string') {
      forwardHeaders['content-type'] = req.headers['content-type'];
    }

    const response = await fetch(backendUrl, {
      method: 'POST',
      // In Node, IncomingMessage is a readable stream, which fetch can use as body
      body: req as unknown as ReadableStream,
      headers: forwardHeaders,
    });

    // Pipe back the exact response from FastAPI
    const text = await response.text();
    res.status(response.status);
    const ct = response.headers.get('content-type') || 'application/json';
    res.setHeader('content-type', ct);
    return res.send(text);
  } catch (error: any) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy failure',
      details: error?.message || 'Unknown error',
    });
  }
}
