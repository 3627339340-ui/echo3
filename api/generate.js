// api/generate.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 导出 generateReply 供 server.js 调用
export async function generateReply(message) {
  const prompt = `
你是一位来自未来的温柔智者，请以“未来的自己写给现在的自己”的信件形式，写一封温暖的回信。
信件格式正确，语气温柔自然，内容积极，字数丰富（200~400字左右）。
用户原始内容如下：
${message}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content.trim();
}

// 提供默认导出（如果有地方使用 import default）
export default { generateReply };
