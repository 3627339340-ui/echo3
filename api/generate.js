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
        content: "你是一位来自5-10年后的自己。请以温暖、睿智、鼓励的语气给现在的自己写一封回信。使用标准的信件格式，字数在300-500字之间，语气真挚、富有洞察力，分享未来的感悟和给现在的建议。"
      },
      {
        role: "user",
        content: "现在的我写给你：" + prompt
      }
    ],
    temperature: 0.85,
    max_tokens: 1200
  };

  const response = await axios.post(endpoint, body, {
    headers: {
      Authorization: "Bearer " + ZHIPU_API_KEY,
      "Content-Type": "application/json"
    },
    timeout: 30000
  });

  const content = response?.data?.choices?.[0]?.message?.content || "未来的你暂时无法回复，请稍后再试。";

  return content;
}

export async function generateReply(message) {
  if (!ZHIPU_API_KEY) {
    return "亲爱的现在的我，\n\n当我坐在未来宁静的书房里，提笔给你写这封信时，心中涌起万千感慨。我能感受到你此刻的焦虑与期待，那些深夜里的迷茫和白日里的奔波，我都历历在目。\n\n请相信，你现在走的每一步都算数。那些看似微不足道的努力，正在悄悄改变着你的人生轨迹。不要急于求成，成长需要时间的沉淀。学会在忙碌中给自己留白，在焦虑中保持耐心。\n\n永远支持你的，\n未来的自己\n\n（这是一封测试回信，请设置ZHIPU_API_KEY环境变量以获得真实的AI回复）";
  }

  try {
    return await callZhipu(message);
  } catch (error) {
    console.error("智谱AI调用错误:", error.message);
    throw new Error("AI服务暂时不可用，请稍后重试");
  }
}
