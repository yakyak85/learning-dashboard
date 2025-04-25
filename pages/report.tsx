import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ReportPage() {
  const router = useRouter();
  const [row, setRow] = useState<number | null>(null);

  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions.length > 0 ? questions[currentIndex] : null;

  // rowをURLパラメータから取得
  useEffect(() => {
    if (router.isReady) {
      const rowParam = router.query.row;
      if (rowParam) {
        const parsed = parseInt(rowParam as string, 10);
        if (!isNaN(parsed)) setRow(parsed);
      }
    }
  }, [router.isReady, router.query.row]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("🟢 Generated questions:", data);
      if (!Array.isArray(data)) throw new Error("Invalid response format");
      setQuestions(data);
      setCurrentIndex(0);
      setSelected(null);
      setFeedback("");
    } catch (e: any) {
      console.error("Error generating questions:", e);
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (choice: string) => {
    if (!currentQuestion) return;
    setSelected(choice);
    const isCorrect = choice === currentQuestion.correct;
    setFeedback(
      isCorrect
        ? "⭕ 正解！"
        : `❌ 不正解。正解は：${currentQuestion.correct}\n理由：${currentQuestion.explanation}`
    );
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setFeedback("");
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/log-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          datetime: new Date().toISOString(),
          row,
        }),
      });

      console.log("📤 Log POST status:", res.status);
      const data = await res.json();
      console.log("📤 Log response:", data);
    } catch (e) {
      console.error("送信エラー:", e);
    } finally {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="container">
      <h1>学習内容の入力</h1>
      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="#今日の学習報告 から始めて入力してください"
      />
      <button className="button" onClick={handleGenerate} disabled={loading}>
        {loading ? "生成中..." : "問題を生成"}
      </button>
      {error && <p style={{ color: "red" }}>エラー: {error}</p>}

      {currentQuestion && (
        <div>
          <h2>
            Q{currentIndex + 1}: {currentQuestion.text}
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {(currentQuestion.options || []).map((choice: string, idx: number) => (
              <li key={idx} style={{ marginBottom: "0.5rem" }}>
                <button
                  onClick={() => handleAnswer(choice)}
                  disabled={selected !== null}
                  className={`choice-btn ${
                    selected === choice
                      ? choice === currentQuestion.correct
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                >
                  {choice}
                </button>
              </li>
            ))}
          </ul>
          {feedback && <p style={{ whiteSpace: "pre-line" }}>{feedback}</p>}

          {selected && currentIndex < questions.length - 1 && (
            <button className="button" onClick={handleNext}>
              次の問題へ
            </button>
          )}

          {selected && currentIndex === questions.length - 1 && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <p style={{ fontWeight: 700, fontSize: "1.2rem" }}>
                🎉 すべての問題が終了しました！
              </p>
              <button className="button" onClick={handleSubmit}>
                学習記録を送信してトップに戻る
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
