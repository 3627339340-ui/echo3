import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import generateRouter from "./api/generate.js";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/generate", generateRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ 未来回音服务器已启动，端口：${PORT}`));
