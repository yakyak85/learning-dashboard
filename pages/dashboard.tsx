import { GetServerSideProps } from "next";

type LearningPlan = {
  "日付・時間帯": string;
  "詳しい学習内容": string;
  "学習の進め方": string;
  "使用する教材": string;
  "必要な費用": string;
  "推奨環境": string;
  "やった？": string;
  "学習時間": string;
};

type Props = {
  plans: LearningPlan[];
};

export default function Dashboard({ plans }: Props) {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-2">今月の学習予定</h1>
      {plans.length === 0 ? (
        <p>読み込みエラー</p>
      ) : (
        <ul className="space-y-2">
          {plans.map((plan, index) => (
            <li key={index} className="border rounded p-2">
              <p className="font-bold">{plan["日付・時間帯"]}</p>
              <p>{plan["詳しい学習内容"]}</p>
              <p className="text-sm text-gray-600">{plan["学習の進め方"]}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbwnBx60lf-KT6D-oY4x04qbs4SD9Uq2wSMxBeytgbB6VwwJoaksPaLdNk6A2UURbxlDEQ/exec"
  );
  let plans: LearningPlan[] = [];

  try {
    plans = await res.json();
  } catch (e) {
    console.error("データ取得エラー:", e);
  }

  return {
    props: {
      plans,
    },
  };
};
