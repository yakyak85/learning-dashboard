// /pages/api/generate-questions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { input } = req.body;
  if (!input) return res.status(400).json({ error: "No input provided" });

  const prompt = `
あなたは学習支援AIです。以下の学習内容に基づいて、理解度を確認するための4択問題を5問作成してください。

出力形式は必ず以下のJSON形式にしてください：

[
  {
    "text": "問題文をここに",
    "correct": "正解の選択肢（例：データのばらつきを示す指標）",
    "explanation": "なぜそれが正解なのかを簡潔に説明",
    "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"]
  },
  ...（合計5問）
]

条件：
- 各問題は学習内容に関係する内容で構成してください。
- 各選択肢はもっともらしく、受験者が迷いそうな表現にしてください。
- 「誤答1」「選択肢A」のような機械的ラベルは使わず、自然な日本語を使ってください。
- 正解は "correct" に含め、"options" の中にも必ず含めてください。
- JSON構造を厳守し、その他の文字列は含めないでください。

学習内容：
${input}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message?.content;
    const parsed = JSON.parse(raw || "[]");
    res.status(200).json(parsed);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
}
