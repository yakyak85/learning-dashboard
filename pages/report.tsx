// /pages/report.tsx
import { useState } from "react";

export default function ReportPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const logRes = await fetch("/api/log-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, datetime: new Date().toISOString() }),
      });

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (choice: string) => {
    setSelected(choice);
    if (!currentQuestion) return;
    const isCorrect = choice === currentQuestion.correct;
    setFeedback(
      isCorrect ? "正解です！\n" + currentQuestion.explanation : "不正解です。\n" + currentQuestion.explanation
    );
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setFeedback("");
    } else {
      setDone(true);
    }
  };

  return (
    <div className="container">
      <h1>学習報告と確認問題</h1>
      {!questions.length && (
        <>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder="#今日の学習報告"
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "生成中..." : "問題を生成"}
          </button>
        </>
      )}

      {questions.length > 0 && !done && (
        <div className="question-block">
          <h2>Q{currentIndex + 1}: {currentQuestion?.text}</h2>
          <ul>
            {currentQuestion.choices.map((choice: string, idx: number) => (
              <li key={idx}>
                <button
                  className={`choice ${selected === choice ? "selected" : ""}`}
                  onClick={() => handleAnswer(choice)}
                  disabled={!!selected}
                >
                  {choice}
                </button>
              </li>
            ))}
          </ul>
          {feedback && (
            <div className="feedback">
              <p>{feedback}</p>
              <button onClick={handleNext}>次の問題へ</button>
            </div>
          )}
        </div>
      )}

      {done && <p>全ての問題が終了しました。お疲れ様でした！</p>}

      <style jsx>{`
        .container {
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
          max-width: 600px;
          margin: auto;
        }
        textarea {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          margin-top: 0.5rem;
        }
        .question-block {
          margin-top: 2rem;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        .choice {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.75rem;
          border: 1px solid #ccc;
          margin-bottom: 0.5rem;
          background: #f9f9f9;
        }
        .selected {
          background-color: #cfe9ff;
        }
        .feedback {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
