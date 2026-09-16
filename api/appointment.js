const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Basic HTML escaping so submitted content can't break the email markup
function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel usually parses JSON bodies, but guard against a string body just in case
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { firstName, lastName, email, phone, company, area, preferredDate, preferredTime, details } = body || {};

  if (!firstName || !email || !area || !preferredDate) {
    return res.status(400).json({ error: 'Missing required fields (name, email, consulting area, preferred date).' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[appointment] RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ryan Harrell Site <site@ryanharrell.com>',
      to: 'ryan@ryanharrell.com',
      replyTo: email,
      subject: `[ryanharrell.com] Consultation Request — ${area} — ${firstName} ${lastName || ''}`.trim(),
      html: `<p><b>From:</b> ${esc(firstName)} ${esc(lastName)} &lt;${esc(email)}&gt;</p>
             <p><b>Phone:</b> ${esc(phone) || '—'}</p>
             <p><b>Business / Company:</b> ${esc(company) || '—'}</p>
             <p><b>Consulting Area:</b> ${esc(area)}</p>
             <p><b>Preferred Date:</b> ${esc(preferredDate)}</p>
             <p><b>Preferred Time:</b> ${esc(preferredTime) || 'No preference'}</p>
             <p><b>Details:</b><br>${esc(details).replace(/\n/g, '<br>')}</p>`,
    });

    if (error) {
      console.error('[appointment] Resend error:', error);
      return res.status(502).json({ error: error.message || 'Email provider rejected the request.' });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error('[appointment] Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected error sending request.' });
  }
};
