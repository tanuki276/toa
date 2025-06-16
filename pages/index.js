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

  // スタイル定義
  const styles = {
    container: {
      maxWidth: 500,
      margin: '60px auto',
      padding: 30,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #e0f2f7, #fff)',
      borderRadius: 12,
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
      transition: 'transform 0.3s ease-in-out',
    },
    title: {
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: 30,
      fontSize: '2.2em',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.05)',
    },
    card: {
      background: 'linear-gradient(45deg, #fff, #f0f8ff)',
      padding: 30,
      borderRadius: 10,
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      lineHeight: 1.8,
      color: '#34495e',
    },
    cardItem: {
      marginBottom: 15,
      display: 'flex',
      alignItems: 'center',
    },
    cardItemLabel: {
      fontWeight: 'bold',
      marginRight: 10,
      color: '#1c3957',
    },
    loading: {
      textAlign: 'center',
      marginTop: 80,
      fontSize: 20,
      color: '#777',
    },
    error: {
      textAlign: 'center',
      marginTop: 80,
      fontSize: 20,
      color: '#e74c3c',
    },
    icon: {
      marginRight: 8,
      color: '#3498db',
      fontSize: '1.2em',
    },
  };

  if (error) return (
    <div style={styles.error}>
      エラー: {error}
      {}
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .${styles.error.className || ''} { 
          animation: shake 0.5s infinite;
        }
      `}</style>
    </div>
  );
  if (!character) return (
    <div style={styles.loading}>
      読み込み中…
      {/* ローディング時のフェードアニメーション */}
      <style jsx global>{`
        @keyframes fade {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
        .${styles.loading.className || ''} { 
          animation: fade 1.5s infinite alternate;
        }
      `}</style>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>キャラクター情報</h1>
      <div style={styles.card}>
        <div style={styles.cardItem}>
          <span style={styles.cardItemLabel}>名前:</span>
          {character.name}
        </div>
        <div style={styles.cardItem}>
          <span style={styles.cardItemLabel}>レア度:</span>
          {character.rarity}
        </div>
        <div style={styles.cardItem}>
          <span style={styles.cardItemLabel}>役割:</span>
          {character.role}
        </div>
      </div>
      {}
      <style jsx>{`
        div:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
