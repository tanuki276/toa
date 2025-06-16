import { useEffect, useState } from 'react';

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/character')
      .then((res) => {
        if (!res.ok) throw new Error('APIエラー');
        return res.json();
      })
      .then((data) => setCharacters(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>エラー: {error}</div>;
  if (characters.length === 0) return <div>読み込み中…</div>;

  return (
    <div>
      <h1>キャラクター一覧</h1>
      <ul>
        {characters.map((char, index) => (
          <li key={index}>
            名前: {char.name} / レア度: {char.rarity} / 役割: {char.role}
          </li>
        ))}
      </ul>
    </div>
  );
}