import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;

export async function generateReply(prompt) {
  try {
    const response = await axios.post(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        model: "glm-4-flash", // 智谱快速高效模型
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${ZHIPU_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("❌ Zhipu API error:", err.response?.data || err.message);
    return "生成失败，请检查智谱 API 密钥或稍后再试。";
  }
}
