import { useState, useEffect } from 'react';

export default function Home() {
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/character')
      .then((res) => {
        if (!res.ok) throw new Error('APIエラー');
        return res.json();
      })
      .then((data) => setCharacter(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>エラー: {error}</div>;
  if (!character) return <div>読み込み中…</div>;

  return (
    <div>
      <h1>キャラクター情報</h1>
      <p>名前: {character.name}</p>
      <p>レア度: {character.rarity}</p>
      <p>役割: {character.role}</p>
    </div>
  );
}