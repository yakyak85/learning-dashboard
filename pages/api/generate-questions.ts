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
    "correct": "正解の選択肢（例：選択肢A）",
    "explanation": "なぜそれが正解なのか簡潔に説明",
    "options": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"]
  },
  ...
]

条件：
- 各問題は学習内容に関係する内容で構成してください。
- 各選択肢は内容的にもっともらしいものにしてください。
- 正解は "correct" に含め、"options" の中にも必ず含めてください。
- 項目名やJSON形式は必ず厳密に守ってください（日本語訳などは不要です）。

学習内容：
${input}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message?.content || "[]";
    const parsed = JSON.parse(raw);
    res.status(200).json(parsed);
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
}