import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ZHIPU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "glm-4",
        messages: [
          { role: "system", content: "你是一位温柔的未来自己，请以信件的语气写一封回信，字数不少于200字。" },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "未来的自己暂时还没来信哦 🌙" });
  } catch (err) {
    res.status(500).json({ error: "生成失败", details: err.message });
  }
});

app.post("/api/voice", async (req, res) => {
  const { text } = req.body;
  try {
    const tts = await fetch(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=zh-CN&client=tw-ob`);
    const arrayBuffer = await tts.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    res.status(500).json({ error: "语音生成失败", details: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
