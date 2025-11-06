import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export async function generateReply(message) {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    console.error("❌ 未检测到 ZHIPU_API_KEY，请在环境变量中设置。");
    return { reply: "⚠️ 服务器未配置智谱 API。" };
  }

  try {
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "glm-4",
        messages: [
          {
            role: "system",
            content: "你是一位温柔的未来自己，请以信件形式回信，语气温暖、细腻、有情感。字数约两百字。"
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "未来的自己暂时无语。";
    return { reply };
  } catch (error) {
    console.error("生成出错：", error);
    return { reply: "服务器暂时无法生成，请稍后再试。" };
  }
}
