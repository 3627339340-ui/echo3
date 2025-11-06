import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import generateRouter from "./api/generate.js";

const app = express();
app.use(express.json());

// 解决路径问题（ESM 下不能用 __dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 前端静态文件
app.use(express.static(path.join(__dirname, "public")));

// 智谱API路由
app.use("/api/generate", generateRouter);

// 默认路由
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 端口监听
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ 服务器已启动：端口 ${PORT}`));
