import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;

export async function generateReply(prompt) {
  try {
    const res = await axios.post(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        model: "glm-4-flash",
        messages: [
          {
            role: "system",
            content:
              "你是一位温柔体贴的未来自我，请用信件形式，字数不少于200字，回复现在的自己。语气真诚温暖，文字优美。",
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${ZHIPU_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data?.choices?.[0]?.message?.content || "暂时无法生成回信。";
  } catch (error) {
    console.error("❌ Zhipu API 调用失败：", error.response?.data || error);
    return "生成回信时出错，请检查 ZHIPU_API_KEY 或稍后再试。";
  }
}
