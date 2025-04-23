import { useState } from "react";

export default function ReportPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleAnswer = (index: number) => {
    const q = questions[currentIndex];
    setSelected(index);
    const isCorrect = index === q.correctIndex;
    setFeedback(isCorrect ? "✅ 正解です！" : `❌ 不正解。${q.explanation}`);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setFeedback("");
  };

  const current = questions[currentIndex];

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h1>学習内容を入力</h1>
      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="# 今日の学習報告 から始めて入力"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", fontSize: "16px" }}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "0.6rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "生成中..." : "問題を生成"}
      </button>

      {current && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "1rem" }}>Q{currentIndex + 1}: {current.text}</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {current.options.map((opt: string, i: number) => (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                <button
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    backgroundColor: selected === i
                      ? (i === current.correctIndex ? "#d1fae5" : "#fee2e2")
                      : "#f9fafb",
                    fontWeight: selected === i ? "bold" : "normal",
                    cursor: selected === null ? "pointer" : "default",
                  }}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              </li>
            ))}
          </ul>

          {feedback && <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{feedback}</p>}
          {selected !== null && currentIndex < questions.length - 1 && (
            <button
              onClick={handleNext}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#34d399",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              次の問題へ
            </button>
          )}
        </div>
      )}
    </div>
  );
}
