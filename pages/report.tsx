// /pages/report.tsx
import { useState } from "react";

export default function ReportPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      setQuestions(data);
      setCurrentIndex(0);
      setSelected(null);
      setFeedback("");
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (choice: string) => {
    if (!currentQuestion) return;
    setSelected(choice);
    const isCorrect = choice === currentQuestion.correct;
    setFeedback(isCorrect ? "⭕ 正解！" : `❌ 不正解。正解は：${currentQuestion.correct}\n理由：${currentQuestion.explanation}`);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setFeedback("");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Hiragino Kaku Gothic ProN', Meiryo, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>学習内容の入力</h1>
      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="#今日の学習報告 から始めて入力してください"
        style={{ width: "100%", padding: "1rem", marginTop: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{ marginTop: "1rem", backgroundColor: "#3b82f6", color: "white", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer" }}
      >
        {loading ? "生成中..." : "問題を生成"}
      </button>

      {currentQuestion && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Q{currentIndex + 1}: {currentQuestion.text}</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {currentQuestion.choices.map((choice: string, index: number) => (
              <li key={index} style={{ marginBottom: "0.5rem" }}>
                <button
                  onClick={() => handleAnswer(choice)}
                  disabled={selected !== null}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    backgroundColor: selected === choice ? (choice === currentQuestion.correct ? "#4ade80" : "#f87171") : "#f3f4f6",
                    border: "1px solid #ccc",
                    cursor: selected ? "default" : "pointer",
                  }}
                >
                  {choice}
                </button>
              </li>
            ))}
          </ul>
          {feedback && <p style={{ marginTop: "1rem", whiteSpace: "pre-line" }}>{feedback}</p>}
          {selected && currentIndex < questions.length - 1 && (
            <button
              onClick={handleNext}
              style={{ marginTop: "1rem", backgroundColor: "#3b82f6", color: "white", padding: "0.5rem 1rem", borderRadius: "6px", border: "none" }}
            >
              次の問題へ
            </button>
          )}

          {selected && currentIndex === questions.length - 1 && (
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "1rem" }}>
                🎉 すべての問題が終了しました！
              </p>
              <button
                onClick={async () => {
                  try {
                    await fetch("/api/log-input", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ input, datetime: new Date().toISOString() }),
                    });
                  } catch (e) {
                    console.error("送信エラー:", e);
                  } finally {
                    window.location.href = "/dashboard";
                  }
                }}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                学習記録を送信してトップに戻る
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
