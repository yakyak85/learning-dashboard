import { useState } from "react";

export default function ReportPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setFeedback("");
    setAnswer(null);
    setCurrent(0);
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setQuestions(data);
    } catch (e) {
      console.error("Error generating questions", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (choice: string) => {
    const q = questions[current];
    setAnswer(choice);
    if (choice === q.correct) {
      setFeedback("正解です！\n理由: " + q.explanation);
    } else {
      setFeedback("不正解です。\n正解: " + q.correct + "\n理由: " + q.explanation);
    }
    setTimeout(() => {
      setAnswer(null);
      setFeedback("");
      setCurrent((prev) => prev + 1);
    }, 3000);
  };

  const q = questions[current];

  return (
    <div className="p-4 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">学習内容の入力</h1>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="#今日の学習報告 から始めて入力してください"
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "生成中..." : "問題を生成"}
      </button>

      {q && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Q{current + 1}: {q.text}</h2>
          <ul className="space-y-2">
            {q.choices.map((c: string, i: number) => (
              <li key={i}>
                <button
                  onClick={() => handleAnswer(c)}
                  disabled={!!answer}
                  className={`w-full text-left px-3 py-2 rounded border ${
                    answer === c ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
          {feedback && <p className="mt-4 whitespace-pre-wrap">{feedback}</p>}
        </div>
      )}

      {!q && questions.length > 0 && (
        <p className="mt-6 text-green-600 font-semibold">全ての問題が終了しました！</p>
      )}
    </div>
  );
}
