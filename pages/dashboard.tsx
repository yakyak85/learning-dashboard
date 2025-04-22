import { useEffect, useState } from "react";

export default function Dashboard() {
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbwnBx60lf-KT6D-oY4x04qbs4SD9Uq2wSMxBeytgbB6VwwJoaksPaLdNk6A2UURbxlDEQ/exec")
      .then((res) => res.json())
      .then((data) => setSchedule(data));
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-2">今日の学習予定</h1>
      {schedule.length === 0 ? (
        <p>読み込み中...</p>
      ) : (
        <ul className="space-y-2">
          {schedule.map((row, i) => (
            <li key={i} className="border p-2 rounded bg-white shadow">
              <p>{row["日付・時間帯"]}：{row["詳しい学習内容"]}</p>
              <p className="text-sm text-gray-500">{row["学習の進め方"]}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
