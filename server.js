import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import generateRoute from "./api/generate.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // 若 index.html 在 public 文件夹
app.use("/api/generate", generateRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
