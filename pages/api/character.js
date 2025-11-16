// 環境変数の読み込み
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN; 

export default async function handler(req, res) {
  const o = req.headers.origin; // リクエスト元のオリジンを取得
  const U = DISCORD_WEBHOOK_URL;
  const O = ALLOWED_ORIGIN;

  // 1. CORS Preflight (OPTIONSメソッド) への対応
  if (req.method === 'OPTIONS') {
    // 許可されたOriginを設定（ブラウザがアクセス可能になる）
    res.setHeader('Access-Control-Allow-Origin', O); 
    // 許可するメソッドとヘッダーを設定
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // 2. POSTメソッドの確認
  if (req.method !== 'POST') {
    return res.status(405).json({m:'Method Not Allowed'});
  }
  
  // POSTリクエストの応答ヘッダーにもCORSを設定
  if (o) res.setHeader('Access-Control-Allow-Origin', o);

  // 3. サーバー設定（環境変数）の確認
  if (!U || !O) {
     return res.status(500).json({m:'Server Config Missing'});
  }
  
  // 4. Originチェック (セキュリティ検証)
  if (o && o !== O) {
    return res.status(403).json({m:'Forbidden'});
  }

  try {
    const surveyData = req.body; 

    // 5. 動的フィールドの生成 (req.bodyのキーと値をすべてDiscord Embedに変換)
    const dynamicFields = Object.keys(surveyData).map(key => {
        // キー名を整形 (例: favorite_game -> Favorite game)
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

        return {
            name: fieldName,
            value: String(surveyData[key]) || 'N/A',
            inline: true // フィールドを横に並べる設定
        };
    });
    
    // 6. Discord ペイロードの構築
    const discordPayload = {
      username: 'Web Form Bot',
      embeds: [{
          title: '📝 New Survey Submission',
          color: 0x5865f2, // Discordの紫色
          fields: dynamicFields,
          timestamp: new Date().toISOString(),
          footer: {
            text: `Source: ${o || 'Direct Access'}`,
          }
      }]
    };

    // 7. Discord Webhookへの送信
    const discordRes = await fetch(U, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    // 8. 成功/失敗の応答
    if (discordRes.ok) {
      return res.status(200).json({m:'OK'});
    } else {
      // Discord API側からのエラー応答
      return res.status(500).json({m:'Discord Error'});
    }

  } catch (e) {
    // 内部エラー (JSON解析失敗など)
    // console.error(e); // 本番環境ではエラーログの確認が重要
    return res.status(500).json({m:'Internal Error'});
  }
}
