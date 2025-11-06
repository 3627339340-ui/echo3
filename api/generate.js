// 智谱未来回音 - 智能回信生成 API
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 智谱 API 配置
const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "缺少输入内容" });
    }

    const systemPrompt = `
你是一封来自未来的信的作者。
请写一封温柔、真诚、语气平和的信，
以未来的自己写给现在的自己为主题。
信件必须有问候、回忆与鼓励，结尾要温暖。
信件应不少于 200 字，以书信格式输出（开头问候、结尾署名）。
`;

    const response = await fetch(ZHIPU_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ZHIPU_API_KEY}`,
      },
      body: JSON.stringify({
        model: "glm-4-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `此刻我写下：${prompt}` },
        ],
        temperature: 0.9,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error("Zhipu API 请求失败：" + text);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "未来的你说：继续相信自己。";

    res.json({ reply });
  } catch (error) {
    console.error("生成出错：", error);
    res.status(500).json({ error: "生成失败，请稍后重试。" });
  }
});

export default router;
