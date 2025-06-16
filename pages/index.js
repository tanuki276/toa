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

  if (error) return <div style={styles.error}>エラー: {error}</div>;
  if (!character) return <div style={styles.loading}>読み込み中…</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>キャラクター情報</h1>
      <div style={styles.card}>
        <p><strong>名前:</strong> {character.name}</p>
        <p><strong>レア度:</strong> {character.rarity}</p>
        <p><strong>役割:</strong> {character.role}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '40px auto',
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    lineHeight: 1.6,
    color: '#444',
  },
  loading: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 18,
    color: '#666',
  },
  error: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 18,
    color: 'red',
  },
};