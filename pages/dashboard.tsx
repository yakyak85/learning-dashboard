import { useEffect, useState } from "react";

export default function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbwnBx60lf-KT6D-oY4x04qbs4SD9Uq2wSMxBeytgbB6VwwJoaksPaLdNk6A2UURbxlDEQ/exec")
      .then((res) => res.json())
      .then((data) => {
        const today = new Date();
        const todayStr = today.toLocaleDateString("ja-JP", {
          month: "numeric",
          day: "numeric",
        });

        const filtered = data.filter((item) => {
          const [date] = item["日付・時間帯"].split(" ");
          return date === todayStr || date === getRelativeDate(today, -1) || date === getRelativeDate(today, 1);
        });

        setSchedule(filtered);
        setLoading(false);
      });
  }, []);

  function getRelativeDate(baseDate, offsetDays) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    });
  }

  const todayStr = new Date().toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
  });

  return (
    <main>
      <h1>今月の学習予定</h1>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className="card-list">
          {schedule.map((item, i) => {
            const [date, time] = item["日付・時間帯"].split(" ");
            const isToday = date === todayStr;
            return (
              <div key={i} className={`card ${isToday ? "today" : date < todayStr ? "past" : "future"}`}>
                <h2>
                  {date} {time}
                </h2>
                <p>{item["詳しい学習内容"]}</p>
                <p>{item["学習の進め方"]}</p>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        main {
          padding: 2rem;
          font-family: "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
          background: #f4f6f8;
          min-height: 100vh;
        }
        h1 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }
        .card-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 1.2rem;
          transition: all 0.3s ease;
        }
        .card h2 {
          font-size: 1.2rem;
          margin: 0 0 0.5rem;
          font-weight: 600;
        }
        .card p {
          margin: 0.3rem 0;
          font-size: 0.95rem;
        }
        .today {
          background: #e0f0ff;
          border: 2px solid #3399ff;
          animation: pulse 1s ease-out;
        }
        .past {
          background: #eeeeee;
          color: #888;
        }
        .future {
          background: #ffffff;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.98);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}
