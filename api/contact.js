import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { firstName, lastName, email, reason, message } = req.body;
  await resend.emails.send({
    from: 'site@ryanharrell.com',
    to: 'ryan@ryanharrell.com',
    subject: `[ryanharrell.com] ${reason} from ${firstName} ${lastName}`,
    html: `<p><b>From:</b> ${firstName} ${lastName} &lt;${email}&gt;</p>
           <p><b>Reason:</b> ${reason}</p>
           <p><b>Message:</b><br>${message}</p>`
  });
  res.status(200).json({ success: true });
}