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

// 检测移动设备
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

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

// 移动端优化：减少星星数量
function spawnStars(count) {
    const starCount = isMobile ? 30 : count;
    for (let i = 0; i < starCount; i++) {
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

// 移动端优化：减少漂浮光斑数量
function createFloatingLights(count) {
    const lightCount = isMobile ? 2 : count;
    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.className = 'floating-light';
        light.style.width = (isMobile ? 80 : 120 + Math.random() * 150) + 'px';
        light.style.height = light.style.width;
        light.style.left = Math.random() * 100 + '%';
        light.style.top = Math.random() * 100 + '%';
        floatingLights.appendChild(light);
    }
}

function openToInput() {
    console.log("Opening envelope...");
    
    envelopeContainer.style.opacity = '0';
    envelopeContainer.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        envelopeContainer.classList.add("hidden");
        inputCard.classList.remove("hidden");
        inputCard.classList.add("fade-in");
        console.log("Input card should be visible now");
        
        setTimeout(() => {
            messageInput.focus();
            // iOS Safari 输入框焦点优化
            if (isIOS) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 100);
            }
        }, 100);
    }, 800);
}

function initEventListeners() {
    console.log("Initializing event listeners...");
    
    if (envelope) {
        // 移动端优化：同时支持点击和触摸
        envelope.addEventListener("click", openToInput);
        envelope.addEventListener("touchend", function(e) {
            e.preventDefault();
            openToInput();
        }, { passive: false });
        console.log("Envelope click listener added");
    } else {
        console.error("Envelope element not found!");
    }
    
    if (generateBtn) {
        generateBtn.addEventListener("click", generateReply);
        generateBtn.addEventListener("touchend", function(e) {
            e.preventDefault();
            generateReply();
        }, { passive: false });
        console.log("Generate button listener added");
    }
    
    // 移动端优化：按钮触摸事件
    if (playBtn) {
        playBtn.addEventListener("click", playSpeech);
        playBtn.addEventListener("touchend", function(e) {
            e.preventDefault();
            playSpeech();
        }, { passive: false });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener("click", pauseSpeech);
        pauseBtn.addEventListener("touchend", function(e) {
            e.preventDefault();
            pauseSpeech();
        }, { passive: false });
    }
    
    if (collapseBtn) {
        collapseBtn.addEventListener("click", collapseLetter);
        collapseBtn.addEventListener("touchend", function(e) {
            e.preventDefault();
            collapseLetter();
        }, { passive: false });
    }
    
    // 移动端优化：防止页面缩放
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

async function generateReply() {
    const txt = messageInput.value.trim();
    if (!txt) {
        alert("请先写下您的心声，未来的自己才能回应您。");
        return;
    }

    console.log("Generating reply for:", txt.substring(0, 50) + "...");
    
    inputCard.classList.add("hidden");
    letterCard.classList.remove("hidden");
    letterCard.classList.add("fade-in");
    letterContent.textContent = "🕒 正在连接未来...\n\n未来的自己正在阅读您的信件，请稍候片刻。";

    try {
        const reply = await fetchReply(txt);
        letterContent.textContent = reply;
        console.log("Reply received successfully");
        
        // 移动端优化：滚动到顶部
        letterContent.scrollTop = 0;
    } catch (err) {
        console.error("Error generating reply:", err);
        letterContent.textContent = "❌ 暂时无法连接到未来，请稍后重试。\n\n可能是时空信号不稳定，请检查网络连接。";
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
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
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
        // iOS Safari 输入框焦点优化
        if (isIOS) {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        }
    }, 100);
}

function init() {
    console.log("Initializing application...");
    console.log("Mobile device:", isMobile);
    console.log("iOS device:", isIOS);
    
    // 移动端优化：根据设备性能调整效果
    spawnStars(isMobile ? 30 : 60);
    createFloatingLights(isMobile ? 2 : 4);
    updateTimeAndBackground();
    setInterval(updateTimeAndBackground, 60000);
    
    const hour = new Date().getHours();
    if (hour >= 19 || hour < 6) {
        showStars();
    }
    
    initEventListeners();
    
    setTimeout(openToInput, 3000);
    
    console.log("Application initialized successfully");
}

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

// 移动端优化：防止双击缩放
let lastTap = 0;
document.addEventListener('touchend', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
        e.preventDefault();
    }
    lastTap = currentTime;
}, false);

// 移动端优化：处理键盘弹出
if (isMobile) {
    window.addEventListener('resize', function() {
        if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') {
            window.setTimeout(function() {
                document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    });
}
