// script.js - 去掉天气效果，只保留太阳月亮
// --- elements ---
const envelopeContainer = document.getElementById("envelopeContainer");
const envelope = document.getElementById("envelope");
const inputCard = document.getElementById("inputCard");
const letterCard = document.getElementById("letterCard");
const messageInput = document.getElementById("messageInput");
const generateBtn = document.getElementById("generateBtn");
const letterContent = document.getElementById("letterContent");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const collapseBtn = document.getElementById("collapseBtn");
const starsContainer = document.getElementById("stars-container");
const floatingLights = document.getElementById("floatingLights");
const sun = document.getElementById("sun");
const moon = document.getElementById("moon");

// --- 时间管理 ---
function updateTimeAndWeather() {
  const now = new Date();
  const h = now.getHours();
  const minutes = now.getMinutes();
  
  // 更新背景根据时间
  updateBackgroundByTime(h);
  
  // 更新太阳/月亮位置
  updateCelestialBodies(h, minutes);
}

function updateBackgroundByTime(hour) {
  let bg;
  if (hour >= 5 && hour < 8) {
    // 清晨 - 淡橙粉
    bg = "linear-gradient(135deg, #FFE4B5, #FFB6C1)";
  } else if (hour >= 8 && hour < 12) {
    // 上午 - 明亮蓝
    bg = "linear-gradient(135deg, #87CEEB, #98FB98)";
  } else if (hour >= 12 && hour < 16) {
    // 中午 - 鲜艳蓝
    bg = "linear-gradient(135deg, #4682B4, #87CEEB)";
  } else if (hour >= 16 && hour < 19) {
    // 傍晚 - 橙紫
    bg = "linear-gradient(135deg, #FF8C00, #DA70D6)";
  } else if (hour >= 19 && hour < 22) {
    // 夜晚初 - 深蓝紫
    bg = "linear-gradient(135deg, #4B0082, #191970)";
  } else {
    // 深夜 - 深蓝黑
    bg = "linear-gradient(135deg, #00008B, #000000)";
  }
  
  document.body.style.background = bg;
}

function updateCelestialBodies(hour, minutes) {
  // 计算一天中的进度 (0-1)
  const dayProgress = (hour * 60 + minutes) / (24 * 60);
  
  // 太阳：6:00-18:00显示
  if (hour >= 6 && hour < 18) {
    sun.style.opacity = '1';
    moon.style.opacity = '0';
    
    // 太阳轨迹：从左到右的弧线
    const sunX = dayProgress * 100;
    const sunY = 30 + 40 * Math.sin((dayProgress - 0.25) * Math.PI);
    
    sun.style.left = `calc(${sunX}% - 60px)`;
    sun.style.top = `${sunY}%`;
  } else {
    sun.style.opacity = '0';
    moon.style.opacity = '1';
    
    // 月亮轨迹：夜晚显示
    const moonX = ((hour - 18 + 24) % 24) / 12 * 100;
    const moonY = 30 + 40 * Math.sin(((moonX / 100) - 0.25) * Math.PI);
    
    moon.style.left = `calc(${moonX}% - 50px)`;
    moon.style.top = `${moonY}%`;
  }
}

// --- 星星效果 ---
function spawnStars(count = 80) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 3 + "s";
    s.style.width = (1 + Math.random() * 3) + "px";
    s.style.height = s.style.width;
    starsContainer.appendChild(s);
  }
}

function showStars() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.style.opacity = '0.6';
    star.style.animation = `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`;
  });
  
  if (!document.querySelector('#starAnimations')) {
    const style = document.createElement('style');
    style.id = 'starAnimations';
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
    `;
    document.head.appendChild(style);
  }
}

function hideStars() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.style.opacity = '0';
  });
}

// --- 漂浮光斑 ---
function createFloatingLights(count = 6) {
  for (let i = 0; i < count; i++) {
    const light = document.createElement('div');
    light.className = 'floating-light';
    light.style.width = `${150 + Math.random() * 200}px`;
    light.style.height = light.style.width;
    light.style.left = `${Math.random() * 100}%`;
    light.style.top = `${Math.random() * 100}%`;
    light.style.animation = `float ${15 + Math.random() * 20}s ease-in-out infinite`;
    light.style.animationDelay = `${Math.random() * 10}s`;
    floatingLights.appendChild(light);
  }
  
  if (!document.querySelector('#lightAnimations')) {
    const style = document.createElement('style');
    style.id = 'lightAnimations';
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        25% { transform: translate(100px, -50px) scale(1.1); opacity: 0.5; }
        50% { transform: translate(50px, -100px) scale(0.9); opacity: 0.4; }
        75% { transform: translate(-50px, -50px) scale(1.05); opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
  }
}

// --- 信封开场行为 ---
function openToInput() {
  envelopeContainer.style.animation = "fadeOut 0.8s ease-out forwards";
  
  setTimeout(() => {
    envelopeContainer.classList.add("hidden");
    inputCard.classList.remove("hidden");
    inputCard.classList.add("fade-in");
    inputCard.setAttribute("aria-hidden", "false");
    messageInput.focus();
  }, 800);
}

envelope.addEventListener("click", openToInput);
setTimeout(openToInput, 3000); // 3秒后自动打开

// --- API调用 ---
async function fetchReply(message) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ message })
  });
  if (!res.ok) {
    const text = await res.text().catch(()=>null);
    throw new Error(text || res.statusText || "请求失败");
  }
  const data = await res.json();
  return data.reply;
}

// --- 生成按钮 ---
generateBtn.addEventListener("click", async ()=>{
  const txt = messageInput.value.trim();
  if (!txt) {
    alert("请先写下您的心声，再寄往未来。");
    return;
  }

  // 切换到回信卡片，显示加载文本
  inputCard.classList.add("hidden");
  letterCard.classList.remove("hidden");
  letterCard.classList.add("fade-in");
  letterContent.textContent = "🕒 正在连接未来，请稍候片刻……\n\n未来的自己正在阅读您的信件，并用心撰写回信。";

  try {
    const reply = await fetchReply(txt);
    // 确保长回复可以滚动
    letterContent.textContent = reply;
  } catch (err) {
    console.error(err);
    letterContent.textContent = "❌ 暂时无法连接到未来，请稍后重试。\n\n可能是时空信号不稳定，请检查网络连接后再次尝试。";
  }
});

// --- 语音控制 ---
let utterance = null;

playBtn.addEventListener("click", ()=>{
  const text = letterContent.textContent;
  if (!text || text.includes("正在连接未来") || text.includes("暂时无法连接")) return;
  
  if (speechSynthesis.speaking) {
    return;
  }
  
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 0.8;
  
  speechSynthesis.speak(utterance);
  playBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
  
  utterance.onend = () => {
    playBtn.classList.remove("hidden");
    pauseBtn.classList.add("hidden");
  };
});

pauseBtn.addEventListener("click", ()=>{
  speechSynthesis.cancel();
  playBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
});

// --- 收起回信 ---
collapseBtn.addEventListener("click", ()=>{
  speechSynthesis.cancel();
  letterCard.classList.add("hidden");
  inputCard.classList.remove("hidden");
  inputCard.classList.add("fade-in");
  messageInput.value = "";
  messageInput.focus();
});

// --- 初始化 ---
function init() {
  spawnStars(80);
  createFloatingLights(6);
  updateTimeAndWeather();
  
  // 每分钟更新一次时间
  setInterval(updateTimeAndWeather, 60000);
}

// 启动
document.addEventListener('DOMContentLoaded', init);

// 添加淡出动画
if (!document.querySelector('#fadeAnimations')) {
  const style = document.createElement('style');
  style.id = 'fadeAnimations';
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;
  document.head.appendChild(style);
}
