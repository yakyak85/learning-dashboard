// /pages/report.tsx
import { useState } from "react";

type Question = {
  text: string;
  options: string[];
  correct: string;
  explanation: string;
};

export default function ReportPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      await fetch("/api/log-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          datetime: new Date().toISOString(),
        }),
      });

      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      // 4択に変換（簡易ランダム）
      const processed: Question[] = data.map((q: any) => {
        const incorrects = Array(3).fill("").map((_, i) => `誤答${i + 1}`);
        const options = [...incorrects, q.correct].sort(() => Math.random() - 0.5);
        return {
          ...q,
          options,
        };
      });

      setQuestions(processed);
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selected) return;
    setSubmitted(true);
    const isCorrect = selected === currentQuestion.correct;
    setFeedback(isCorrect ? "正解！" : `不正解：${currentQuestion.explanation}`);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    setFeedback("");
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {!questions.length ? (
        <>
          <h1 className="text-xl font-bold mb-4">学習内容の入力</h1>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#今日の学習報告 から始めて入力してください"
          />
          <button
            onClick={handleGenerate}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "生成中..." : "問題を生成"}
          </button>
        </>
      ) : currentIndex < questions.length ? (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Q{currentIndex + 1}: {currentQuestion.text}
          </h2>
          <ul className="space-y-2">
            {currentQuestion.options.map((opt, idx) => (
              <li
                key={idx}
                className={`border p-2 rounded cursor-pointer ${
                  selected === opt ? "bg-blue-100" : ""
                }`}
                onClick={() => !submitted && setSelected(opt)}
              >
                {opt}
              </li>
            ))}
          </ul>
          {!submitted ? (
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={!selected}
              onClick={handleSubmitAnswer}
            >
              回答する
            </button>
          ) : (
            <>
              <p className="mt-4">{feedback}</p>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleNext}
              >
                次の問題へ
              </button>
            </>
          )}
        </>
      ) : (
        <p>全ての問題が終了しました。</p>
      )}
    </div>
  );
}