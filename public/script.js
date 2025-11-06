// script.js
// --- elements ---
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

// --- background by time (only colors change; title fixed) ---
function updateBackgroundByTime(){
  const h = new Date().getHours();
  let bg;
  if (h >= 6 && h < 12) {
    // morning - soft warm
    bg = "linear-gradient(160deg,#fff6f2,#f7e9e2)";
  } else if (h >= 12 && h < 17) {
    // daytime - light neutral
    bg = "linear-gradient(160deg,#f7f7f5,#efece8)";
  } else if (h >= 17 && h < 20) {
    // dusk - warm mauve
    bg = "linear-gradient(160deg,#f6e7eb,#efd6e2)";
  } else {
    // night - soft desaturated blue
    bg = "linear-gradient(160deg,#e8eaf6,#d8dbe8)";
  }
  document.body.style.background = bg;
}
updateBackgroundByTime();
setInterval(updateBackgroundByTime, 60_000);

// --- generate star particles (decor) ---
function spawnStars(count = 36){
  for(let i=0;i<count;i++){
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random()*100 + "%";
    s.style.top = Math.random()*100 + "%";
    s.style.animationDelay = Math.random()*3 + "s";
    s.style.width = (1 + Math.random()*3) + "px";
    s.style.height = s.style.width;
    starsContainer.appendChild(s);
  }
}
spawnStars(48);

// --- envelope open behavior ---
function openToInput(){
  envelope.style.display = "none";
  inputCard.style.display = "flex";
  inputCard.setAttribute("aria-hidden","false");
  messageInput.focus();
}
envelope.addEventListener("click", openToInput);
setTimeout(openToInput, 3000); // auto open after 3s

// --- API call: POST /api/generate with { message } ---
async function fetchReply(message){
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

// --- generate button ---
generateBtn.addEventListener("click", async ()=>{
  const txt = messageInput.value.trim();
  if (!txt) {
    alert("请输入文字再生成回信。");
    return;
  }

  // swap to letter card with loading text
  inputCard.style.display = "none";
  letterCard.style.display = "flex";
  letterContent.textContent = "正在生成来自未来的回信，请稍候……";

  try {
    const reply = await fetchReply(txt);
    // ensure long reply has scroll
    letterContent.textContent = reply;
  } catch (err) {
    console.error(err);
    letterContent.textContent = "生成失败，请稍后重试。";
  }
});

// --- speech controls using browser SpeechSynthesis ---
let utterance = null;

playBtn.addEventListener("click", ()=>{
  const text = letterContent.textContent;
  if (!text) return;
  // if already speaking via utterance, ignore
  if (speechSynthesis.speaking) {
    // toggle handled by pause button
    return;
  }
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 1.0;
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

// --- collapse back to input ---
collapseBtn.addEventListener("click", ()=>{
  speechSynthesis.cancel();
  letterCard.style.display = "none";
  inputCard.style.display = "flex";
  messageInput.value = "";
  messageInput.focus();
});
