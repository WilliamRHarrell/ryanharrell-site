const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Basic HTML escaping so message content can't break the email markup
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
  const { firstName, lastName, email, reason, message } = body || {};

  if (!firstName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields (name, email, message).' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ryan Harrell Site <site@ryanharrell.com>',
      to: 'ryan@ryanharrell.com',
      replyTo: email,
      subject: `[ryanharrell.com] ${reason || 'General Inquiry'} from ${firstName} ${lastName || ''}`.trim(),
      html: `<p><b>From:</b> ${esc(firstName)} ${esc(lastName)} &lt;${esc(email)}&gt;</p>
             <p><b>Reason:</b> ${esc(reason)}</p>
             <p><b>Message:</b><br>${esc(message).replace(/\n/g, '<br>')}</p>`,
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return res.status(502).json({ error: error.message || 'Email provider rejected the request.' });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected error sending message.' });
  }
};
