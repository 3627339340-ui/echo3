import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
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
            content: "你是一位温柔、富有共情的朋友，用200字左右的中文信件形式，温暖地回复用户。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "未来的信件还在路上，请稍后再试 💌";
    res.json({ reply });
  } catch (err) {
    console.error("生成回信时出错：", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
