import { useState } from "react";

export default function ReportPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const res = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setQuestions(data.questions);
    setSubmitted(true);

    // コスト記録（localStorage）
    const prev = Number(localStorage.getItem("monthlyCost") || "0");
    const updated = prev + (data.costJpy || 0);
    localStorage.setItem("monthlyCost", updated.toFixed(2));
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>学習報告</h1>

      {!submitted ? (
        <>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="今日の学習内容を箇条書きで入力"
            rows={6}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <button onClick={handleSubmit}>問題を作成する</button>
        </>
      ) : (
        <div>
          <h2>問題一覧</h2>
          {questions.map((q, i) => (
            <div key={i} style={{ marginBottom: "1rem" }}>
              <p><strong>Q{i + 1}:</strong> {q.text}</p>
              <p><em>正解:</em> {q.correct}</p>
              <p><em>解説:</em> {q.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}