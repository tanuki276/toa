// pages/index.js

import React, { useState } from 'react';

export default function SurveyForm() {
  const [name, setName] = useState('');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('送信中...');

    try {
      const response = await fetch('/api/character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, answer }),
      });

      if (response.ok) {
        setMessage('✅ アンケート回答が正常に送信されました。');
        setName('');
        setAnswer('');
      } else {
        const errorData = await response.json();
        setMessage(`❌ 送信失敗: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ ネットワークエラーが発生しました。');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Next.js アンケートフォーム</h1>
      <p>このフォームからの回答が /api/character を経由してDiscordに送信されます。</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name">お名前:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="answer">自由回答:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            rows="5"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>回答を送信</button>
      </form>
      {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}