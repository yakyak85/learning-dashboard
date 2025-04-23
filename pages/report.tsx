import { useState } from 'react';

export default function ReportPage() {
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuestions([]);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(data);
      } else {
        setError(data.error || 'エラーが発生しました');
      }
    } catch (err) {
      setError('通信エラーが発生しました');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">学習内容の報告</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows={4}
          placeholder="今日やったことを入力してください"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading || !input}
        >
          {loading ? '生成中...' : '問題を生成する'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">生成された問題</h2>
          {questions.map((q: any, idx: number) => (
            <div key={idx} className="border p-4 rounded">
              <p className="font-medium">{q.text}</p>
              <p className="text-sm text-green-600 mt-2">正解: {q.correct}</p>
              <p className="text-sm text-gray-500">解説: {q.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
