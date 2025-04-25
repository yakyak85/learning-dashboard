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
あなたは学習サポートAIです。
以下の学習内容を読んで、それに関する4択問題を5問作成してください。

# 出力形式はJSON
[
  {
    "text": "問題文",
    "options": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    "correctIndex": 正解の選択肢番号 (0〜3),
    "explanation": "正解の簡単な理由（1〜2文）"
  },
  ...
]

# 学習内容:
${input.slice(0, 500)}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000, // 軽量化のため追加
    });

    const raw = completion.choices[0].message?.content;
    console.log("GPT raw output:", raw); // 確認用ログ
    const parsed = JSON.parse(raw || "[]");
    res.status(200).json(parsed);
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
}
