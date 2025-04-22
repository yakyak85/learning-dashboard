import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    async function fetchSchedule() {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("learning_schedule")
        .select("*")
        .eq("date", today)
        .eq("time_slot", "夜")
        .eq("user_id", "ysk@example.com")
        .single();
      if (data) setSchedule(data);
    }
    fetchSchedule();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-2">今日の学習予定</h1>
      {schedule ? (
        <div>
          <p>📆 {schedule.date}（{schedule.time_slot}）</p>
          <p>📝 {schedule.content}</p>
        </div>
      ) : (
        <p>今日の予定はありません。</p>
      )}
    </main>
  );
}