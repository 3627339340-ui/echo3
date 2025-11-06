import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt || "请生成一封温暖的未来回信。";
    const apiKey = process.env.ZHIPU_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "缺少 ZHIPU_API_KEY 环境变量" });
    }

    // 💌 调用智谱AI生成未来回信（200字以上）
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "glm-4", // 智谱通用模型
        messages: [
          {
            role: "system",
            content: "你是一位温柔、细腻、治愈的未来信使，用优美语言写回信。"
          },
          {
            role: "user",
            content: `请为以下文字生成一封不少于200字的回信，内容温暖治愈、真诚、具有情感深度。\n\n来信内容：${prompt}`
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

app.get("/", (_, res) => {
  res.send("💌 未来回音 API 正在运行。");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
