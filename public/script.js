const form = document.getElementById("messageForm");
const input = document.getElementById("userInput");
const replyBox = document.getElementById("replyBox");
const bg = document.body;

// 动态背景色
function updateBackgroundByTime() {
  const hour = new Date().getHours();
  let gradient;
  if (hour >= 6 && hour < 12)
    gradient = "linear-gradient(135deg, #FFF8E1, #FFECB3)";
  else if (hour >= 12 && hour < 18)
    gradient = "linear-gradient(135deg, #B2EBF2, #80DEEA)";
  else if (hour >= 18 && hour < 21)
    gradient = "linear-gradient(135deg, #FFCCBC, #FFAB91)";
  else gradient = "linear-gradient(135deg, #1A237E, #0D47A1)";
  bg.style.background = gradient;
}

// 星光闪烁
function createStar() {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * 100 + "vw";
  star.style.top = Math.random() * 100 + "vh";
  star.style.animationDuration = 1 + Math.random() * 2 + "s";
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 3000);
}

// 信封漂浮
function spawnEnvelope() {
  const el = document.createElement("div");
  el.className = "envelope";
  el.style.left = Math.random() * 100 + "vw";
  el.style.animationDuration = 10 + Math.random() * 15 + "s";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 20000);
}

// 定时刷新
setInterval(updateBackgroundByTime, 60000);
updateBackgroundByTime();
setInterval(spawnEnvelope, 4000);
setInterval(createStar, 1000);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;
  replyBox.textContent = "💭 正在倾听你的心声...";
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  replyBox.textContent = data.reply;
});
