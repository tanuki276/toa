export default async function handler(req, res) {
  const token = process.env.BRAWLSTARS_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'トークン未設定' });
  }

  try {
    const apiUrl = `https://api-brawlstars-character.vercel.app/api/character?token=${token}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: '外部APIエラー' });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'サーバーエラー', detail: err.message });
  }
}