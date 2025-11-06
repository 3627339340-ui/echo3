import express from "express";
import { generateReply } from "./api/generate.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/generate", async (req, res) => {
  const { message } = req.body;
  const result = await generateReply(message);
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 未来回音已启动：http://localhost:${PORT}`));
