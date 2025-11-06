// api/generate.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "缺少 prompt 参数" });
    }

    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "ZHIPU_API_KEY 未设置" });
    }

    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "glm-4-flash",
        messages: [
          {
            role: "system",
            content: "你是一位温柔、充满共情力的回信者，像朋友一样写信安慰、鼓励用户，用约200字中文回复。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400
      })
    });

    const data = await response.json();
    if (!data || !data.choices || !data.choices[0]) {
      throw new Error("API响应无效");
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
