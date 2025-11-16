// pages/api/character.js

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const origin = req.headers.origin;
  if (ALLOWED_ORIGIN && origin && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ message: 'Forbidden: Request origin is not allowed.' });
  }

  if (!DISCORD_WEBHOOK_URL) {
     return res.status(500).json({ message: 'Server configuration error: Webhook URL is missing.' });
  }

  try {
    const { name, answer } = req.body;

    const discordPayload = {
      username: 'アンケートボット (Next.js)',
      embeds: [
        {
          title: '🔥 新しいキャラクター回答 🔥',
          color: 0x00ff00,
          fields: [
            { name: '回答者', value: name || '匿名', inline: true },
            { name: '回答内容', value: answer || '回答なし', inline: false },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: `Source: ${origin || 'Direct Access'}`,
          }
        },
      ],
    };

    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload),
    });

    if (discordRes.ok) {
      res.status(200).json({ message: 'Survey response sent successfully to Discord.' });
    } else {
      console.error('Discord API Error:', await discordRes.text());
      res.status(500).json({ message: 'Failed to send message to Discord.' });
    }

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
}