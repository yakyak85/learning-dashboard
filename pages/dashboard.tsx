// /pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const GAS_URL = "https://script.google.com/macros/s/AKfycbwnBx60lf-KT6D-oY4x04qbs4SD9Uq2wSMxBeytgbB6VwwJoaksPaLdNk6A2UURbxlDEQ/exec";

export default function Dashboard() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GAS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        console.log("Fetched schedule JSON:", json);
        setSchedule(json); // 全件表示して動作確認
      } catch (e: any) {
        console.error("Fetch error:", e);
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>学習予定一覧</h1>

      {loading && <p>読み込み中…</p>}
      {error && <p style={{ color: "red" }}>エラー: {error}</p>}

      {!loading && !error && (
        <div className="cards">
          {schedule.length === 0 && <p>予定がありませんでした。</p>}
          {schedule.map((item, i) => (
            <div
              key={i}
              className="card"
              onClick={() => router.push(`/report?row=${i + 3}`)}
            >
              <h2>{item["日付・時間帯"]}</h2>
              <p>{item["詳しい学習内容"]}</p>
              <p>{item["学習の進め方"]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
