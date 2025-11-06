import express from "express";
import fetch from "node-fetch";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt || "";
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "ZHIPU_API_KEY 未设置" });

    const systemMsg = `你是“未来的我”。请以书信格式（称呼、正文、结束语和署名）写一封信，语气温柔真诚，富有鼓励性，给现在的我一些安慰和启发。中文字数不少于200字。`;

    const body = {
      model: "glm-4-flash",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: prompt || "我现在有些迷茫，请未来的我给我一封信。" }
      ],
      max_tokens: 800,
      temperature: 0.85
    };

    const resp = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() ||
      "未来的信件暂时无法生成，请稍后再试。";

    res.json({ reply });
  } catch (e) {
    console.error("生成失败：", e);
    res.status(500).json({ error: "生成失败" });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("✅ Server running on port", process.env.PORT || 3000)
);
