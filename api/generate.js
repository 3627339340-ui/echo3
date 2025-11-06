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
        content: `你是一位来自5-10年后的自己。请以温暖、亲切、真诚的语气给现在的自己写一封回信。
        
重要要求：
1. 以"亲爱的现在的我"或类似的亲切称呼开头
2. 使用第一人称"我"来指代未来的自己
3. 语气要像亲密朋友或家人一样自然、亲切
4. 分享一些未来生活中的小细节，让回信更真实可信
5. 对现在的困惑表示理解和共情
6. 给予具体、实用的建议，而不是空洞的鼓励
7. 适当使用口语化的表达，如"你知道吗"、"其实啊"等
8. 字数在400-600字之间
9. 以温暖鼓励的话语结尾，并署名"未来的你"或类似

请让回信充满人情味，就像真的在跟过去的自己对话一样。`
      },
      {
        role: "user",
        content: `现在的我写给你：${prompt}`
      }
    ],
    temperature: 0.9,
    max_tokens: 1500
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
    return `亲爱的现在的我，

展信佳。

刚刚翻看旧物时，偶然发现了你这封信。坐在未来家中温暖的灯光下，我忍不住微笑——原来那时候的你是这样的心情啊。

你知道吗？现在的我常常会想起这段时光。那些你以为过不去的坎，其实都在悄悄塑造着你。记得你总担心选择错了方向，但我想告诉你，人生没有白走的路，每一步都算数。

我特别理解你现在的焦虑。面对未知，谁都会害怕。但请相信，正是这些不安和迷茫，让你变得更加坚韧。现在的我，很感谢当初没有放弃的你。

给你一个小建议：试着把大目标拆解成小步骤。就像我当初一样，每天进步一点点，不知不觉就走到了今天。别给自己太大压力，成长需要时间。

对了，告诉你一个好消息。现在的我养了一只可爱的猫，它总喜欢在我看书时趴在腿上。生活比我们想象的要温柔得多。

所以，请放宽心，好好享受这个过程。未来的风景很美，但最美的其实是此刻勇敢前行的你。

永远为你加油，
未来的自己

（这是一封测试回信，请设置ZHIPU_API_KEY环境变量以获得真实的AI回复）`;
  }

  try {
    return await callZhipu(message);
  } catch (error) {
    console.error("智谱AI调用错误:", error.message);
    throw new Error("AI服务暂时不可用，请稍后重试");
  }
}
