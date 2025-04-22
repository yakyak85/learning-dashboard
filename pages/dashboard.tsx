import { useEffect, useState } from "react";

export default function Dashboard() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbwnBx60lf-KT6D-oY4x04qbs4SD9Uq2wSMxBeytgbB6VwwJoaksPaLdNk6A2UURbxlDEQ/exec");
        const json = await res.json();

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${parseInt(mm)}/${parseInt(dd)}`;

        // 4日分（昨日・今日・明日・明後日）を抽出
        const targetDates = Array.from({ length: 4 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - 1 + i);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const filtered = json.filter((item: any) =>
          targetDates.some(d => item["日付・時間帯"].startsWith(d))
        );

        // 日付・時間帯順でソート
        filtered.sort((a: any, b: any) => a["日付・時間帯"].localeCompare(b["日付・時間帯"]));

        setSchedule(filtered);
        setLoading(false);
      } catch (e) {
        console.error("Fetch error", e);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const today = new Date();
  const mmdd = `${today.getMonth() + 1}/${today.getDate()}`;

  return (
    <div className="container">
      <h1>今月の学習予定</h1>
      {loading ? <p>読み込み中...</p> : (
        <div className="cards">
          {schedule.map((item, i) => {
            const isToday = item["日付・時間帯"].startsWith(mmdd);
            return (
              <div
                key={i}
                className={`card ${isToday ? "today" : item["日付・時間帯"] < mmdd ? "past" : "future"}`}
              >
                <h2>{item["日付・時間帯"]}</h2>
                <p>{item["詳しい学習内容"]}</p>
                <p>{item["学習の進め方"]}</p>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .card {
          padding: 1.2rem;
          border-radius: 12px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          background: white;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .past {
          background: #f1f1f1;
          color: #777;
        }
        .today {
          background: #e6f0ff;
          border-color: #0070f3;
          color: #003366;
          animation: popIn 0.8s ease;
        }
        .future {
          background: #fff;
        }
        @keyframes popIn {
          0% { transform: scale(0.97); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
