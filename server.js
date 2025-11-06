// server.js
import express from "express";
import cors from "cors";
import { generateReply } from "./api/generate.js";  // ✅ 有效导入

const app = express();
app.use(cors());
app.use(express.json());

// 未来回信接口
app.post("/api/generate", async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await generateReply(message);
    res.json({ reply });
  } catch (err) {
    console.error("生成错误：", err);
    res.status(500).json({ error: "生成失败" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
