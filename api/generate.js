// api/generate.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ 导出函数
export async function generateReply(message) {
  const prompt = `
你是来自未来的自己，请写一封温暖、真诚的信给现在的自己，
信件语气自然，格式规范（包括称呼与结尾），
内容要富有感情、鼓励与反思，长度不少于200字。
用户写给未来的信息如下：
${message}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content.trim();
}

export default { generateReply };
