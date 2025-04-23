import { useState } from "react";

export default function ReportPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">学習報告と確認問題</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="学習した内容をここに入力..."
          className="w-full border rounded p-2 h-32"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "生成中..." : "問題を生成"}
        </button>
      </form>

      {questions.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">確認問題</h2>
          {questions.map((q, idx) => (
            <div key={idx} className="border p-3 rounded">
              <p className="font-medium">Q{idx + 1}: {q.text}</p>
              <p>正解: {q.correct}</p>
              <p className="text-sm text-gray-600">理由: {q.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
