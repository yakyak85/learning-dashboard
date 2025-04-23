import { useState } from 'react';

export default function ReportPage() {
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setQuestions(data.questions || []);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '20px' }}>
      <h1>学習報告 & 問題生成</h1>
      <textarea
        rows={6}
        style={{ width: '100%', padding: 10, fontSize: 16 }}
        placeholder="今日学んだことをここに書いてください"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: '10px 20px',
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        {loading ? '生成中...' : '問題を生成'}
      </button>

      <div style={{ marginTop: 30 }}>
        {questions.map((q, index) => (
          <div
            key={index}
            style={{
              marginBottom: 20,
              padding: 15,
              background: '#f9f9f9',
              borderRadius: 8,
            }}
          >
            <p><strong>Q{index + 1}:</strong> {q.text}</p>
            <p><strong>正解:</strong> {q.correct}</p>
            <p><strong>解説:</strong> {q.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
