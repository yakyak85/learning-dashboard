// /pages/api/generate-questions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { input } = req.body;
  if (!input) return res.status(400).json({ error: "Missing input" });

  const prompt = `
あなたは学習支援AIです。以下の学習内容に基づいて、理解度を確認するクイズを5問作成してください。
JSON形式で以下のように出力してください：

[
  {
    "text": "問題文",
    "correct": "正解のテキスト",
    "explanation": "正解の理由を簡潔に"
  },
  ...
]

学習内容:
${input}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message?.content || "[]";
    const jsonStart = raw.indexOf("[");
    const questions = JSON.parse(raw.slice(jsonStart));

    const totalTokens = completion.usage?.total_tokens || 0;
    const costJpy = (totalTokens / 1000) * 0.0015 * 150; // GPT-3.5単価＆150円換算

    res.status(200).json({ questions, costJpy });
  } catch (error) {
    console.error("GPT出題エラー:", error);
    res.status(500).json({ error: "問題生成に失敗しました" });
  }
}
