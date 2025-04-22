import { useEffect, useState } from "react";

export default function Dashboard() {
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSchedule() {
      const res = await fetch("https://script.google.com/macros/s/AKfycbwnBx60lf-KT6D-oY4x04qbs4SD9Uq2wSMxBeytgbB6VwwJoaksPaLdNk6A2UURbxlDEQ/exec");
      const allData = await res.json();

      const today = new Date().toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      });

      const filtered = allData.filter((row: any) => row["日付・時間帯"]?.startsWith(today));
      setSchedule(filtered);
    }

    fetchSchedule();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">今日の学習予定</h1>
      {schedule.length === 0 ? (
        <p>該当なし</p>
      ) : (
        schedule.map((row, idx) => (
          <div key={idx} className="mb-4">
            <p className="font-semibold">・{row["日付・時間帯"]}：{row["詳しい学習内容"]}</p>
            <p>{row["学習の進め方"]}</p>
          </div>
        ))
      )}
    </main>
  );
}
