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
    const { prompt } = req.body;
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "ZHIPU_API_KEY 未设置" });

    const systemPrompt = `
你是“未来的我”。请以书信格式写一封信：
- 开头称呼“亲爱的现在的我”；
- 内容温柔、理性、安慰、鼓励；
- 字数不少于200字；
- 结尾署名“——未来的你”；
`;

    const body = {
      model: "glm-4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt || "请未来的我写一封信给现在的我。" }
      ],
      temperature: 0.85,
      max_tokens: 800
    };

    const resp = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "未来暂时无语，请稍后再试。";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "生成失败" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("✅ Server running"));
