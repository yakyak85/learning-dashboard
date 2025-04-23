// /pages/report.tsx
import { useState } from "react";

export default function ReportPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    console.log("✅ handleGenerate called");
    if (!input.trim()) {
      console.log("⚠️ 空の入力です");
      return;
    }

    setLoading(true);

    try {
      console.log("📝 ログを送信中...");
      const logRes = await fetch("/api/log-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          datetime: new Date().toISOString(),
        }),
      });
      console.log("✅ ログ送信結果:", await logRes.json());

      console.log("🎯 問題生成をリクエスト中...");
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      console.log("✅ 生成された問題:", data);
      setQuestions(data);
    } catch (error) {
      console.error("❌ エラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">学習内容の入力</h1>
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        value={input}
        onChange={(e) => {
          console.log("✏️ 入力更新:", e.target.value);
          setInput(e.target.value);
        }}
        placeholder="#今日の学習報告 から始めて入力してください"
      />
      <button
        onClick={handleGenerate}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!input.trim() || loading}
      >
        {loading ? "生成中..." : "問題を生成"}
      </button>

      {questions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">生成された問題</h2>
          <ul className="space-y-4">
            {questions.map((q, index) => (
              <li key={index} className="border p-3 rounded shadow-sm">
                <strong>Q{index + 1}:</strong> {q.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
