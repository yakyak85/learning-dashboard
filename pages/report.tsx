import { useState } from "react";

export default function ReportPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setQuestions([]);

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      // 安全確認：全てに選択肢があるか
      const validated = Array.isArray(data) ? data.filter(q => q.choices && q.choices.length === 4) : [];
      setQuestions(validated);
    } catch (error) {
      console.error("生成失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>学習内容の入力</h1>
      <textarea
        style={styles.textarea}
        rows={5}
        placeholder="#今日の学習報告 を書いてください"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button style={styles.button} onClick={handleGenerate} disabled={loading}>
        {loading ? "生成中..." : "問題を生成"}
      </button>

      {questions.length > 0 && (
        <div style={styles.questionList}>
          <h2 style={styles.subheading}>生成された問題</h2>
          {questions.map((q, idx) => (
            <div key={idx} style={styles.card}>
              <p><strong>Q{idx + 1}:</strong> {q.text}</p>
              <ul>
                {q.choices?.map((choice: string, i: number) => (
                  <li key={i}>{String.fromCharCode(65 + i)}. {choice}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "1rem",
    fontFamily: "'Noto Sans JP', sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  textarea: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "1rem",
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  button: {
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
  },
  questionList: {
    marginTop: "2rem",
  },
  subheading: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  card: {
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
  },
};