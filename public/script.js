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

function updateTimeAndBackground() {
  const now = new Date();
  const h = now.getHours();
  updateBackgroundByTime(h);
  updateCelestialBodies(h);
}

function updateBackgroundByTime(hour) {
  let bg;
  if (hour >= 5 && hour < 8) {
    bg = "linear-gradient(135deg, #FFE8D6, #FFD1DC)";
  } else if (hour >= 8 && hour < 12) {
    bg = "linear-gradient(135deg, #D4F1F9, #E2F0CB)";
  } else if (hour >= 12 && hour < 16) {
    bg = "linear-gradient(135deg, #C5E3F6, #DCD3F9)";
  } else if (hour >= 16 && hour < 19) {
    bg = "linear-gradient(135deg, #FEC5E5, #F8D6A3)";
  } else if (hour >= 19 && hour < 22) {
    bg = "linear-gradient(135deg, #A8BFFF, #D9A7FF)";
  } else {
    bg = "linear-gradient(135deg, #6A82FB, #3A1C71)";
  }
  document.body.style.background = bg;
}

function updateCelestialBodies(hour) {
  if (hour >= 6 && hour < 18) {
    sun.style.opacity = '1';
    moon.style.opacity = '0';
    const progress = (hour - 6) / 12;
    const sunX = 10 + progress * 80;
    const sunY = 80 - Math.sin(progress * Math.PI) * 60;
    sun.style.left = sunX + '%';
    sun.style.top = sunY + '%';
  } else {
    sun.style.opacity = '0';
    moon.style.opacity = '1';
    const progress = ((hour + 6) % 12) / 12;
    const moonX = 10 + progress * 80;
    const moonY = 80 - Math.sin(progress * Math.PI) * 60;
    moon.style.left = moonX + '%';
    moon.style.top = moonY + '%';
  }
}

function spawnStars(count) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.width = (1 + Math.random() * 2) + "px";
    s.style.height = s.style.width;
    starsContainer.appendChild(s);
  }
}

function showStars() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.style.opacity = '0.4';
  });
}

function createFloatingLights(count) {
  for (let i = 0; i < count; i++) {
    const light = document.createElement('div');
    light.className = 'floating-light';
    light.style.width = (120 + Math.random() * 150) + 'px';
    light.style.height = light.style.width;
    light.style.left = Math.random() * 100 + '%';
    light.style.top = Math.random() * 100 + '%';
    floatingLights.appendChild(light);
  }
}

function openToInput() {
  envelopeContainer.style.animation = "fadeOut 0.8s ease-out forwards";
  setTimeout(() => {
    envelopeContainer.classList.add("hidden");
    inputCard.classList.remove("hidden");
    inputCard.classList.add("fade-in");
    messageInput.focus();
  }, 800);
}

envelope.addEventListener("click", openToInput);
setTimeout(openToInput, 3000);

async function fetchReply(message) {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ message })
    });
    if (!res.ok) {
      throw new Error("请求失败");
    }
    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.error("API请求错误:", error);
    throw error;
  }
}

generateBtn.addEventListener("click", async ()=>{
  const txt = messageInput.value.trim();
  if (!txt) {
    alert("请先写下您的心声，再寄往未来。");
    return;
  }

  inputCard.classList.add("hidden");
  letterCard.classList.remove("hidden");
  letterCard.classList.add("fade-in");
  letterContent.textContent = "正在连接未来，请稍候片刻...";

  try {
    const reply = await fetchReply(txt);
    letterContent.textContent = reply;
  } catch (err) {
    letterContent.textContent = "暂时无法连接到未来，请稍后重试。";
  }
});

let utterance = null;

playBtn.addEventListener("click", ()=>{
  const text = letterContent.textContent;
  if (!text) return;
  
  if (speechSynthesis.speaking) {
    return;
  }
  
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9;
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

collapseBtn.addEventListener("click", ()=>{
  speechSynthesis.cancel();
  letterCard.classList.add("hidden");
  inputCard.classList.remove("hidden");
  inputCard.classList.add("fade-in");
  messageInput.value = "";
  messageInput.focus();
});

function init() {
  spawnStars(60);
  createFloatingLights(4);
  updateTimeAndBackground();
  setInterval(updateTimeAndBackground, 60000);
  
  const hour = new Date().getHours();
  if (hour >= 19 || hour < 6) {
    showStars();
  }
}

document.addEventListener('DOMContentLoaded', init);
