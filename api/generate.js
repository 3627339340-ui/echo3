import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY || "";

async function callZhipu(prompt) {
  const endpoint = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
  const body = {
    model: "glm-4-flash",
    messages: [
      {
        role: "system",
        content: "你是一位来自未来的自己（5-10年后）。请以温暖、睿智、鼓励的语气给现在的自己写一封回信。内容要真挚、富有洞察力，分享未来的感悟和给现在的建议。使用标准的信件格式（称呼、正文、结尾、署名），字数在300-500字之间。要体现出时间的沉淀和成长的智慧。"
      },
      {
        role: "user",
        content: `现在的我写给你：${prompt}`
      }
    ],
    temperature: 0.85,
    max_tokens: 1200
  };

  const resp = await axios.post(endpoint, body, {
    headers: {
      Authorization: `Bearer ${ZHIPU_API_KEY}`,
