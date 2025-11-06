import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt || "请生成一封温暖的未来回信。";
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "缺少 ZHIPU_API_KEY 环境变量" });

    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "glm-4",
        messages: [
          {
            role: "system",
            content: "你是一位温柔、细腻、治愈的未来信使，用真诚、优美的语言回信。"
          },
          {
            role: "user",
            content: `请为以下文字生成一封不少于200字的回信，语气温暖、真诚、带情感。\n\n来信内容：${prompt}`
          }
        ],
        max_tokens: 800,
        temperature: 0.85
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "未来的回音未能抵达，请稍后再试 🌸";
    res.json({ reply });
  } catch (error) {
    console.error("API错误：", error);
    res.status(500).json({ error: "未来的信件迷路了，请稍后再试 💫" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Future Echo server running on port ${PORT}`));
