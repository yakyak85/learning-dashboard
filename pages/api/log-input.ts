// /pages/api/log-input.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input, datetime, row } = req.body;
  if (!input || !datetime || row === undefined) {
    return res.status(400).json({ error: "Missing input, datetime or row" });
  }

  try {
    const sheetUrl = process.env.GOOGLE_SHEET_API_URL;
    const payload = {
      mode: "log-input",
      input,
      datetime,
      row,
    };

    const response = await fetch(sheetUrl!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to log input:", errorText);
      return res.status(500).json({ error: "GAS logging failed" });
    }

    return res.status(200).json({ message: "Logged successfully" });
  } catch (error) {
    console.error("Error logging input:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
