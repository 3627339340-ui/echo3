// api/voice.js
import express from "express";
import fetch from "node-fetch";
const router = express.Router();

// Simple proxy to fetch TTS audio from a public endpoint (example: Google translate tts).
// NOTE: This is a convenience; reliability and licensing may vary. Browser TTS (speechSynthesis) is preferred.
router.post("/", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: "missing text" });

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=zh-CN&client=tw-ob`;
    const r = await fetch(ttsUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return res.status(502).json({ error: "TTS provider failed" });

    const arrayBuffer = await r.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("voice error:", err);
    res.status(500).json({ error: "语音生成失败" });
  }
});

export default router;
