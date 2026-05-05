exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appx92IiIetb4TSjB';

  try {
    const data = JSON.parse(event.body);

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
          'Full Name': `${data.enfant_prenom} ${data.enfant_nom}`,
          'Programme Enrolled': data.programme || 'A confirmer',
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
          'Parent Contact Name': `${data.parent_prenom} ${data.parent_nom}`,
          'WhatsApp Number': data.telephone,
          'Email': data.email,
          'Players': [player.id]
        }
      })
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
