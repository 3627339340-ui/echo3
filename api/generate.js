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
        content:
          "你是一位来自未来的自己。请以信件格式（称呼、正文、结尾署名）写一封温柔、真挚的回信，语气鼓励并富有温度，内容不少于200字。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.9,
    max_tokens: 800
  };

  const resp = await axios.post(endpoint, body, {
    headers: {
      Authorization: `Bearer ${ZHIPU_API_KEY}`,
      "Content-Type": "application/json"
    },
    timeout: 30000
  });

  // 尽量稳健取出文本
  const content =
    resp?.data?.choices?.[0]?.message?.content ||
    resp?.data?.message ||
    (typeof resp?.data === "string" ? resp.data : null);

  return content || "未来的你暂时无法回复，请稍后再试。";
}

export async function generateReply(message) {
  if (!ZHIPU_API_KEY) {
    // 本地/测试友好模拟回复
    return `（未配置 ZHIPU_API_KEY）模拟回信：
亲爱的现在的我，
未来的你看到了这封信。请相信你此刻的努力并非徒劳，尽管路上有困惑与疲惫，但那正是在塑造你的坚韧。记住要温柔地对待自己，给自己安排小小的休息与仪式感。未来会感谢今天努力的你。
—— 未来的你`;
  }

  try {
    return await callZhipu(message);
  } catch (err) {
    console.error("Zhipu 调用出错：", err?.response?.data || err.message || err);
    throw err;
  }
}

export default { generateReply };
