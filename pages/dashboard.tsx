import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyCost, setMonthlyCost] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // ...fetch logicはそのまま
  }, []);

  useEffect(() => {
    const stored = Number(localStorage.getItem('monthlyCost') || '0');
    setMonthlyCost(stored);
  }, []);

  const today = new Date();
  const mmdd = `${today.getMonth() + 1}/${today.getDate()}`;

  return (
    <div className="container">
      <h1>今月の学習予定</h1>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className="cards">
          {schedule.map((item, i) => {
            const datePart = item['日付・時間帯'].split(' ')[0];
            const dateObj = new Date(`${today.getFullYear()}/${datePart}`);
            const isToday = item['日付・時間帯'].startsWith(mmdd);
            const isPast = dateObj < today;
            return (
              <div
                key={i}
                className={`card ${isToday ? 'today' : isPast ? 'past' : 'future'}`}
                onClick={() => router.push(`/report?row=${i + 3}`)}
              >
                <h2>{item['日付・時間帯']}</h2>
                <p>{item['詳しい学習内容']}</p>
                <p>{item['学習の進め方']}</p>
              </div>
            );
          })}
        </div>
      )}

      <p className="cost">今月のGPT出題コスト：{monthlyCost.toFixed(2)} 円</p>
    </div>
  );
}
