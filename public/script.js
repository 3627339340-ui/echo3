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

// 修复：确保DOM完全加载后再执行
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing...");
    init();
});

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

// 修复：改进信封打开函数
function openToInput() {
    console.log("Opening envelope...");
    
    // 添加淡出动画
    envelopeContainer.style.opacity = '0';
    envelopeContainer.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        envelopeContainer.classList.add("hidden");
        inputCard.classList.remove("hidden");
        inputCard.classList.add("fade-in");
        console.log("Input card should be visible now");
        
        // 确保输入框获得焦点
        setTimeout(() => {
            messageInput.focus();
        }, 100);
    }, 800);
}

// 修复：确保事件监听器正确绑定
function initEventListeners() {
    console.log("Initializing event listeners...");
    
    // 信封点击事件
    if (envelope) {
        envelope.addEventListener("click", openToInput);
        console.log("Envelope click listener added");
    } else {
        console.error("Envelope element not found!");
    }
    
    // 生成按钮事件
    if (generateBtn) {
        generateBtn.addEventListener("click", generateReply);
        console.log("Generate button listener added");
    }
    
    // 语音控制事件
    if (playBtn) playBtn.addEventListener("click", playSpeech);
    if (pauseBtn) pauseBtn.addEventListener("click", pauseSpeech);
    if (collapseBtn) collapseBtn.addEventListener("click", collapseLetter);
}

async function generateReply() {
    const txt = messageInput.value.trim();
    if (!txt) {
        alert("请先写下您的心声，再寄往未来。");
        return;
    }

    console.log("Generating reply for:", txt.substring(0, 50) + "...");
    
    inputCard.classList.add("hidden");
    letterCard.classList.remove("hidden");
    letterCard.classList.add("fade-in");
    letterContent.textContent = "正在连接未来，请稍候片刻...";

    try {
        const reply = await fetchReply(txt);
        letterContent.textContent = reply;
        console.log("Reply received successfully");
    } catch (err) {
        console.error("Error generating reply:", err);
        letterContent.textContent = "暂时无法连接到未来，请稍后重试。错误: " + err.message;
    }
}

async function fetchReply(message) {
    try {
        const res = await fetch("/api/generate", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ message })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data.reply;
    } catch (error) {
        console.error("API请求错误:", error);
        throw new Error("网络请求失败，请检查连接");
    }
}

let utterance = null;

function playSpeech() {
    const text = letterContent.textContent;
    if (!text || text.includes("正在连接未来") || text.includes("暂时无法连接")) return;
    
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
}

function pauseSpeech() {
    speechSynthesis.cancel();
    playBtn.classList.remove("hidden");
    pauseBtn.classList.add("hidden");
}

function collapseLetter() {
    speechSynthesis.cancel();
    letterCard.classList.add("hidden");
    inputCard.classList.remove("hidden");
    inputCard.classList.add("fade-in");
    messageInput.value = "";
    setTimeout(() => {
        messageInput.focus();
    }, 100);
}

function init() {
    console.log("Initializing application...");
    
    // 初始化视觉效果
    spawnStars(60);
    createFloatingLights(4);
    updateTimeAndBackground();
    setInterval(updateTimeAndBackground, 60000);
    
    const hour = new Date().getHours();
    if (hour >= 19 || hour < 6) {
        showStars();
    }
    
    // 初始化事件监听器
    initEventListeners();
    
    // 3秒后自动打开信封
    setTimeout(openToInput, 3000);
    
    console.log("Application initialized successfully");
}

// 添加必要的CSS动画
if (!document.querySelector('#custom-animations')) {
    const style = document.createElement('style');
    style.id = 'custom-animations';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
            animation: fadeIn 0.8s ease-out;
        }
    `;
    document.head.appendChild(style);
}
