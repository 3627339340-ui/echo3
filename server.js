import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import generateRoute from "./api/generate.js";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 解析 JSON
app.use(express.json());

// 静态托管前端
app.use(express.static(path.join(__dirname, "public")));

// 后端 API 路由
app.use("/api", generateRoute);

// 假如访问根路径（如 / ），则返回主页
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Zeabur 会自动注入 PORT 环境变量
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
