import { useEffect, useState } from "react";
import Head from "next/head";
import nProgress from "nprogress";

export default function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        nProgress.start();
        const res = await fetch("https://script.google.com/macros/s/AKfycbwnBx60lf-KT6D-oY4x04qbs4SD9Uq2wSMxBeytgbB6VwwJoaksPaLdNk6A2UURbxlDEQ/exec");
        const data = await res.json();

        // 日付部分だけ取り出してフィルタ
        const getDayLabel = (offset = 0) => {
          const d = new Date();
          d.setDate(d.getDate() + offset);
          return `${d.getMonth() + 1}/${d.getDate()}`;
        };

        const today = getDayLabel(0);
        const dayLabels = [getDayLabel(-1), today, getDayLabel(1), getDayLabel(2)];

        const filtered = data.filter((item) =>
          dayLabels.some((label) => item["日付・時間帯"]?.startsWith(label))
        );

        setSchedule(filtered);
      } catch (e) {
        console.error("取得エラー:", e);
      } finally {
        setLoading(false);
        nProgress.done();
      }
    };

    fetchSchedule();
  }, []);

  const getCardStyle = (dateLabel) => {
    const today = new Date();
    const todayStr = `${today.getMonth() + 1}/${today.getDate()}`;

    if (dateLabel.startsWith(todayStr)) return "card current";

    const target = new Date(`${today.getFullYear()}/${dateLabel.split(" ")[0]}`);
    return target < today ? "card past" : "card future";
  };

  return (
    <>
      <Head>
        <title>今月の学習予定</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" />
      </Head>
      <main>
        <h1>今月の学習予定</h1>
        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <div className="card-container">
            {schedule.map((item, i) => (
              <div key={i} className={getCardStyle(item["日付・時間帯"]) + (getCardStyle(item["日付・時間帯"]) === "card current" ? " animate" : "")}> 
                <h2>{item["日付・時間帯"]}</h2>
                <p>{item["詳しい学習内容"]}</p>
                <p>{item["学習の進め方"]}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        main {
          padding: 2rem;
          font-family: sans-serif;
        }
        h1 {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .card-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }
        .card {
          border-radius: 0.75rem;
          padding: 1rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          transition: transform 0.3s ease;
          background-color: #fff;
        }
        .card.current {
          border: 2px solid #3b82f6;
          background-color: #e0f2fe;
        }
        .card.past {
          background-color: #f3f4f6;
          color: #6b7280;
        }
        .card.future {
          background-color: #ffffff;
        }
        .animate {
          animation: pulse 1s ease-in-out;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
