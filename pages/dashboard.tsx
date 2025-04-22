import { useEffect, useState } from "react";

export default function Dashboard() {
  const [scheduleData, setScheduleData] = useState([]);
  const [todayString, setTodayString] = useState("");
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    const mm = (today.getMonth() + 1).toString().padStart(2, "0");
    const dd = today.getDate().toString().padStart(2, "0");
    setTodayString(`${mm}/${dd}`);

    fetch(
      "https://script.google.com/macros/s/AKfycbwnBx60lf-KT6D-oY4x04qbs4SD9Uq2wSMxBeytgbB6VwwJoaksPaLdNk6A2UURbxlDEQ/exec"
    )
      .then((res) => res.json())
      .then((data) => {
        setScheduleData(data);
      });
  }, []);

  const sortedData = [...scheduleData].sort((a, b) =>
    a["日付・時間帯"].localeCompare(b["日付・時間帯"])
  );

  const todayIndex = sortedData.findIndex((row) =>
    row["日付・時間帯"].includes(todayString)
  );

  const displayData = sortedData.slice(
    Math.max(todayIndex - 1, 0),
    Math.min(todayIndex + 2 + 1, sortedData.length)
  );

  useEffect(() => {
    if (todayIndex !== -1) {
      setTimeout(() => setAnimatedIndex(todayIndex), 300); // 遅延でアニメーション開始
    }
  }, [todayIndex]);

  return (
    <main>
      <h1>今月の学習予定</h1>
      <div className="card-list">
        {displayData.map((row, i) => {
          const isToday = row["日付・時間帯"].includes(todayString);
          const isPast = i < 1;
          const isFuture = i > 1;
          const className = isToday
            ? "card today"
            : isPast
            ? "card past"
            : "card future";

          const animate = isToday && i === animatedIndex;

          return (
            <div
              key={i}
              className={`${className} ${animate ? "animate" : ""}`}
            >
              <h2>{row["日付・時間帯"]}</h2>
              <p>{row["詳しい学習内容"]}</p>
              <p className="sub">{row["学習の進め方"]}</p>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        main {
          padding: 2rem;
          font-family: sans-serif;
        }
        h1 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }
        .card-list {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .card {
          flex: 1 1 300px;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #ddd;
          transition: transform 0.3s ease;
        }
        .card h2 {
          font-size: 1.2rem;
          margin: 0 0 0.5rem 0;
        }
        .card.today {
          background: #e3f2fd;
          border-left: 6px solid #4285f4;
          box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
        }
        .card.future {
          background: #ffffff;
          color: #333;
        }
        .card.past {
          background: #f0f0f0;
          color: #888;
        }
        .sub {
          font-size: 0.9rem;
          margin-top: 0.5rem;
          color: #666;
        }
        .animate {
          animation: hoverPop 0.4s ease-in-out;
        }

        @keyframes hoverPop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}
