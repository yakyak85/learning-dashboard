import { useEffect, useState } from "react";

export default function Dashboard() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyCost, setMonthlyCost] = useState(0);

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

        const targetDates = Array.from({ length: 4 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - 1 + i);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const filtered = json.filter((item: any) =>
          targetDates.some(d => item["日付・時間帯"].startsWith(d))
        );

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

  useEffect(() => {
    const stored = Number(localStorage.getItem("monthlyCost") || "0");
    setMonthlyCost(stored);
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
            const isPast = new Date(`${today.getFullYear()}/${item["日付・時間帯"].split(' ')[0]}`) < today;
            const isFuture = new Date(`${today.getFullYear()}/${item["日付・時間帯"].split(' ')[0]}`) > today;
            return (
              <div
                key={i}
                className={`card ${isToday ? "today" : isPast ? "past" : "future"}`}
              >
                <h2>{item["日付・時間帯"]}</h2>
                <p>{item["詳しい学習内容"]}</p>
                <p>{item["学習の進め方"]}</p>
              </div>
            );
          })}
        </div>
      )}

      <p className="cost">今月のGPT出題コスト：{monthlyCost.toFixed(2)} 円</p>

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .card {
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          background: #fff;
          transition: transform 0.3s ease;
        }
        .card h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .card p {
          margin: 0.25rem 0;
        }
        .past {
          background-color: #f3f4f6;
          color: #9ca3af;
        }
        .today {
          background-color: #e0f2ff;
          border: 2px solid #3b82f6;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
        }
        .future {
          background-color: #ffffff;
        }
        .cost {
          margin-top: 2rem;
          text-align: right;
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}
