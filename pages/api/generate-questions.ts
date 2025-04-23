// /pages/api/generate-questions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: "No input provided" });
  }

  const prompt = `
あなたは学習支援AIです。以下の学習内容に基づいて、理解度を確認するための4択問題を5問作成してください。
JSON形式で以下のように出力してください（"choices"は必ず4つ、"correct"は選択肢のテキストと一致するように）：

[
  {
    "text": "問題文",
    "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    "correct": "正しい選択肢のテキスト",
    "explanation": "正解の理由"
  }
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

    const raw = completion.choices[0].message?.content;
    const parsed = JSON.parse(raw || "[]");
    res.status(200).json(parsed);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
}