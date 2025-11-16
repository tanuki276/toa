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
const surveyData = req.body;

const dynamicFields = Object.keys(surveyData).map(key => {  
    const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');  

    return {  
        name: fieldName,  
        value: String(surveyData[key]) || '回答なし',  
        inline: true  
    };  
});  
  
const discordPayload = {  
  username: 'ヨシフ・アドルフ=レオポルド2世',  
  embeds: [  
    {  
      title: '新',  
      color: 0x5865f2,  
      fields: dynamicFields,  
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