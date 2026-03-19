export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { endpoint, body, ashbyKey } = req.body;

  if (!endpoint || !ashbyKey) {
    res.status(400).json({ error: 'Missing endpoint or ashbyKey' });
    return;
  }

  try {
    const response = await fetch(`https://api.ashbyhq.com${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(ashbyKey + ':'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body || {}),
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
