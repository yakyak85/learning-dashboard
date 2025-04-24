import { useState } from 'react';

export default function ReportPage() {
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    // ...fetchロジックはそのまま
  };

  const handleAnswer = (choice: string) => {
    if (!currentQuestion) return;
    setSelected(choice);
    const isCorrect = choice === currentQuestion.correct;
    setFeedback(
      isCorrect
        ? '⭕ 正解！'
        : `❌ 不正解。正解は：${currentQuestion.correct}\n理由：${currentQuestion.explanation}`
    );
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setFeedback('');
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
      <button
        className="button"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? '生成中...' : '問題を生成'}
      </button>

      {currentQuestion && (
        <div>
          <h2>Q{currentIndex + 1}: {currentQuestion.text}</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {currentQuestion.choices.map((choice: string, idx: number) => (
              <li key={idx}>
                <button
                  className={`choice-btn ${
                    selected === choice
                      ? choice === currentQuestion.correct
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  }`}
                  onClick={() => handleAnswer(choice)}
                  disabled={selected !== null}
                >
                  {choice}
                </button>
              </li>
            ))}
          </ul>
          {feedback && <p style={{ whiteSpace: 'pre-line' }}>{feedback}</p>}

          {selected && currentIndex < questions.length - 1 && (
            <button className="button" onClick={handleNext}>
              次の問題へ
            </button>
          )}

          {selected && currentIndex === questions.length - 1 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>🎉 すべての問題が終了しました！</p>
              <button
                className="button"
                onClick={async () => {
                  // log-input 呼び出し
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
