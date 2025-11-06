import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.ZHIPU_API_KEY;

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
            content: "你是一位温柔、充满共情的朋友，用约200字中文回复来安慰和鼓励用户。"
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
    res.json({ reply: data.choices?.[0]?.message?.content || "抱歉，未来的回音似乎迷路了。" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
