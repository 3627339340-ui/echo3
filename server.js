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

// POST /api/generate  接收 { message }
app.post("/api/generate", async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "message 不能为空" });
    }
    const reply = await generateReply(message.trim());
    return res.json({ reply });
  } catch (err) {
    console.error("ERROR /api/generate:", err);
    return res.status(500).json({ error: "生成失败" });
  }
});

// Fallback to index.html for SPA-like behavior
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ future-echo server started on port ${PORT}`);
});
