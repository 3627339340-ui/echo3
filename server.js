// server.js (ESM)
import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/generate", async (req, res) => {
  try {
    const prompt = (req.body?.prompt || "").toString().trim();
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "ZHIPU_API_KEY 未配置" });
    }

    // 构造对模型的指令：写一封来自“未来的自己”给“现在的自己”的信
    const systemMsg = `你是“未来的我”。请以书信格式（称呼、正文、结束语和署名）写一封信，给“现在的我”。语气温和、真诚、富有同理心和鼓励性，围绕成长、宽慰、建议与希望，包含具体可行的建议或视角。字数不少于200字（中文），不要显示任何API内部信息，结尾署名为“来自未来的你”。`;

    const body = {
      model: "glm-4-flash",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: prompt || "我现在感到有些迷茫/疲惫，请给我回信。" }
      ],
      max_tokens: 800,
      temperature: 0.85
    };

    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(body),
      timeout: 45000
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("智谱返回非200：", response.status, text);
      return res.status(500).json({ error: "AI接口返回错误" });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim()
      || "来自未来的回信暂时无法生成，请稍后再试。";

    // 如果返回内容过短，作为兜底生成一段本地模板（确保一定有较长内容）
    if (reply.length < 120) {
      const fallback = `亲爱的现在的我：\n\n` +
        `也许此刻的你正被许多小事牵扯，感到疲惫或不安。请先深呼吸，给自己一点温柔的时间。我希望你能相信——那些看似无解的困境，会在时间和行动中慢慢变成你可以讲述的故事。` +
        `记得分解任务，允许自己有不完美的日子，同时保留小小的仪式感（比如写日记、散步或与可信任的人聊聊），这些都会让你重新找到节奏。未来的你仍然会为现在坚持的你而感到自豪。\n\n` +
        `愿你温柔以待自己。\n\n来自未来的你`;
      return res.json({ reply: fallback });
    }

    res.json({ reply });
  } catch (err) {
    console.error("生成回信失败：", err);
    res.status(500).json({ error: "生成失败，请稍后重试" });
  }
});

// healthcheck
app.get("/_health", (_, res) => res.send("ok"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ future-echo server listening on ${PORT}`));
