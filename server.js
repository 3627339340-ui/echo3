import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { generateReply } from "./api/generate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  const reply = await generateReply(prompt);
  res.json({ reply });
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
