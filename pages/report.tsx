// /pages/report.tsx
import { useState } from "react";

export default function ReportPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSelected(null);
    setFeedback("");
    setCurrent(0);
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setQuestions(data.slice(0, 5));
    } catch (e) {
      alert("問題の生成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    const correct = questions[current].correct;
    const explanation = questions[current].explanation;
    const isCorrect = choice === correct;
    setFeedback(`${isCorrect ? "⭕️ 正解" : "❌ 不正解"}：${explanation}`);

    setTimeout(() => {
      setSelected(null);
      setFeedback("");
      setCurrent((prev) => prev + 1);
    }, 2500);
  };

  const q = questions[current];

  return (
    <div className="container">
      <h1>学習報告</h1>
      {!questions.length ? (
        <>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#今日の学習報告 から始めてください"
          />
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "生成中..." : "問題を生成"}
          </button>
        </>
      ) : current < questions.length ? (
        <div className="quiz">
          <p className="q">{`Q${current + 1}. ${q.text}`}</p>
          <ul>
            {q.choices.map((c: string, i: number) => (
              <li
                key={i}
                className={`choice ${selected === c ? "selected" : ""}`}
                onClick={() => handleAnswer(c)}
              >
                {c}
              </li>
            ))}
          </ul>
          <p className="feedback">{feedback}</p>
        </div>
      ) : (
        <p>全問終了しました！お疲れさまでした。</p>
      )}

      <style>{`
        .container {
          padding: 16px;
          max-width: 600px;
          margin: auto;
          font-family: 'Hiragino Kaku Gothic ProN', sans-serif;
        }
        textarea {
          width: 100%;
          height: 120px;
          margin-top: 12px;
          padding: 8px;
          font-size: 16px;
        }
        button {
          margin-top: 12px;
          padding: 10px 20px;
          font-size: 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
        }
        .quiz {
          margin-top: 24px;
        }
        .q {
          font-weight: bold;
          margin-bottom: 12px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        .choice {
          background: #f1f5f9;
          margin-bottom: 8px;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .choice:hover {
          background: #e0f2fe;
        }
        .selected {
          background: #bae6fd;
        }
        .feedback {
          margin-top: 12px;
          font-size: 14px;
          color: #333;
        }
        @media (max-width: 600px) {
          .container {
            padding: 12px;
          }
          textarea {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
