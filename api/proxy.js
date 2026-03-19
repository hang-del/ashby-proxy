const https = require('https');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { endpoint, body, ashbyKey } = req.body || {};

  if (!endpoint || !ashbyKey) {
    res.status(200).json({ success: false, results: [], errors: ['Missing endpoint or ashbyKey'] });
    return;
  }

  const encoded = Buffer.from(ashbyKey + ':').toString('base64');
  const postData = JSON.stringify(body || {});

  const options = {
    hostname: 'api.ashbyhq.com',
    path: endpoint,
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + encoded,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const ashbyReq = https.request(options, function(ashbyRes) {
    let data = '';
    ashbyRes.on('data', function(chunk) { data += chunk; });
    ashbyRes.on('end', function() {
      try {
        const parsed = JSON.parse(data);
        res.status(200).json(parsed);
      } catch(e) {
        res.status(200).json({ success: false, results: [], raw: data.substring(0, 200) });
      }
    });
  });

  ashbyReq.on('error', function(err) {
    res.status(200).json({ success: false, results: [], error: err.message });
  });

  ashbyReq.write(postData);
  ashbyReq.end();
};
