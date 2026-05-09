const ALLOWED_ORIGIN = 'https://coerver-tunisie.netlify.app';

exports.handler = async function(event, context) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appx92IiIetb4TSjB';

  if (!TOKEN) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      body: JSON.stringify({ success: false, error: 'Server configuration error' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Input validation
    const required = ['enfant_prenom', 'enfant_nom', 'parent_prenom', 'parent_nom', 'telephone'];
    for (const field of required) {
      if (!data[field] || typeof data[field] !== 'string' || data[field].trim().length < 2) {
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          body: JSON.stringify({ success: false, error: `Missing or invalid field: ${field}` })
        };
      }
    }

    // Sanitize inputs — strip HTML tags
    const sanitize = (str) => (str || '').replace(/<[^>]*>/g, '').trim().slice(0, 200);

    const headers = {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    };

    // 1. Create Player record
    const playerRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/tblO49rDoSSn1uvGe`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fields: {
          'Full Name': `${sanitize(data.enfant_prenom)} ${sanitize(data.enfant_nom)}`,
          'Programme Enrolled': sanitize(data.programme) || 'A confirmer',
          'Start Date': new Date().toISOString().split('T')[0]
        }
      })
    });
    const player = await playerRes.json();

    if (!player.id) {
      throw new Error('Player creation failed: ' + JSON.stringify(player));
    }

    // 2. Create Parent record with correct field names
    await fetch(`https://api.airtable.com/v0/${BASE_ID}/tblOUpQ6pmswUhUke`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fields: {
          'Parent Contact Name': `${sanitize(data.parent_prenom)} ${sanitize(data.parent_nom)}`,
          'WhatsApp Number': sanitize(data.telephone),
          'Email': sanitize(data.email),
          'Players': [player.id]
        }
      })
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
