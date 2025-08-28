export default async function handler(req, res) {
  console.log('Test Vercel function called');
  
  return res.json({
    message: 'Vercel function is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers
  });
}
