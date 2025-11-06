import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { generateReply } from "./api/generate.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API路由
app.post("/api/generate", async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "消息内容不能为空" });
    }
    const reply = await generateReply(message.trim());
    return res.json({ reply });
  } catch (err) {
    console.error("ERROR /api/generate:", err);
    return res.status(500).json({ error: "生成失败，请稍后重试" });
  }
});

// 健康检查端点
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// SPA回退
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Future Echo 服务器已启动在端口 ${PORT}`);
  console.log(`📧 ZHIPU_API_KEY: ${process.env.ZHIPU_API_KEY ? "已设置" : "未设置"}`);
});
