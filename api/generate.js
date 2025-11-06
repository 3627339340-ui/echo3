import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "请输入给未来自己的信件内容。" });
    }

    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "未检测到 ZHIPU_API_KEY 环境变量。" });
    }

    // 智谱 GLM-4-Flash 智能生成回复
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
            content:
              "你是一位温柔的未来自己，请用信件格式回复现在的自己，语气温和、真挚，给出鼓励与温暖。信件内容不少于200字。"
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      throw new Error("智谱 API 未返回有效内容");
    }

    const reply = data.choices[0].message.content;

    // 返回文本给前端
    res.json({ reply });
  } catch (err) {
    console.error("生成失败:", err);
    res.status(500).json({ error: err.message || "生成失败，请稍后再试。" });
  }
});

export default router;
