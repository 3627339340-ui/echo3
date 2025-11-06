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

// 检测移动设备和浏览器
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);
const isWechat = /MicroMessenger/.test(navigator.userAgent);
const isBaidu = /baiduboxapp/.test(navigator.userAgent);

console.log("设备信息:", {
    isMobile,
    isIOS,
    isAndroid,
    isWechat,
    isBaidu,
    userAgent: navigator.userAgent
});

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
            if (isIOS) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 100);
            }
        }, 100);
    }, 800);
}

// 改进的事件绑定函数 - 专门处理安卓浏览器兼容性
function addMobileCompatibleEventListener(element, event, handler) {
    if (!element) return;
    
    // 对于安卓浏览器，同时绑定多个事件类型确保兼容性
    if (isAndroid) {
        element.addEventListener('click', handler);
        element.addEventListener('touchend', handler);
        element.addEventListener('touchstart', function(e) {
            // 添加触摸反馈
            e.currentTarget.style.opacity = '0.7';
            setTimeout(() => {
                e.currentTarget.style.opacity = '1';
            }, 150);
        });
    } else {
        element.addEventListener(event, handler);
    }
}

function initEventListeners() {
    console.log("Initializing event listeners...");
    
    // 信封事件
    if (envelope) {
        addMobileCompatibleEventListener(envelope, 'click', openToInput);
        console.log("Envelope event listener added");
    } else {
        console.error("Envelope element not found!");
    }
    
    // 生成按钮事件
    if (generateBtn) {
        addMobileCompatibleEventListener(generateBtn, 'click', generateReply);
        console.log("Generate button listener added");
    }
    
    // 播放/暂停/收起按钮事件 - 特别处理安卓兼容性
    if (playBtn) {
        addMobileCompatibleEventListener(playBtn, 'click', playSpeech);
        console.log("Play button listener added");
    }
    
    if (pauseBtn) {
        addMobileCompatibleEventListener(pauseBtn, 'click', pauseSpeech);
        console.log("Pause button listener added");
    }
    
    if (collapseBtn) {
        addMobileCompatibleEventListener(collapseBtn, 'click', collapseLetter);
        console.log("Collapse button listener added");
    }
    
    // 为安卓浏览器添加额外的触摸事件处理
    if (isAndroid) {
        document.addEventListener('touchstart', function() {
            // 空函数，确保触摸事件能被正确捕获
        });
        
        // 防止安卓浏览器中的点击延迟
        if ('ontouchstart' in window) {
            document.addEventListener('touchstart', function() {}, true);
        }
    }
    
    // 防止页面缩放
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
    console.log("Play speech button clicked");
    
    const text = letterContent.textContent;
    if (!text || text.includes("正在连接未来") || text.includes("暂时无法连接")) {
        console.log("No valid content to play");
        return;
    }
    
    if (speechSynthesis.speaking) {
        console.log("Already speaking");
        return;
    }
    
    try {
        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "zh-CN";
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        // 添加错误处理
        utterance.onerror = function(event) {
            console.error("Speech synthesis error:", event);
            alert("语音播放失败，请检查浏览器设置或尝试其他浏览器");
        };
        
        speechSynthesis.speak(utterance);
        playBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
        
        utterance.onend = () => {
            console.log("Speech ended");
            playBtn.classList.remove("hidden");
            pauseBtn.classList.add("hidden");
        };
        
        console.log("Speech started successfully");
    } catch (error) {
        console.error("Error starting speech:", error);
        alert("您的浏览器不支持语音功能，请尝试使用Chrome浏览器");
    }
}

function pauseSpeech() {
    console.log("Pause speech button clicked");
    
    try {
        speechSynthesis.cancel();
        playBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
        console.log("Speech paused successfully");
    } catch (error) {
        console.error("Error pausing speech:", error);
    }
}

function collapseLetter() {
    console.log("Collapse letter button clicked");
    
    try {
        speechSynthesis.cancel();
        letterCard.classList.add("hidden");
        inputCard.classList.remove("hidden");
        inputCard.classList.add("fade-in");
        messageInput.value = "";
        setTimeout(() => {
            messageInput.focus();
            if (isIOS) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 100);
            }
        }, 100);
        console.log("Letter collapsed successfully");
    } catch (error) {
        console.error("Error collapsing letter:", error);
    }
}

function init() {
    console.log("Initializing application...");
    console.log("设备信息:", { isMobile, isAndroid, isIOS, isWechat, isBaidu });
    
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
        
        /* 安卓浏览器特别优化 */
        .control-btn {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-tap-highlight-color: rgba(0,0,0,0.1);
        }
        
        /* 确保按钮在安卓浏览器中可点击 */
        button, .btn, .control-btn {
            cursor: pointer;
            touch-action: manipulation;
        }
    `;
    document.head.appendChild(style);
}

// 安卓浏览器特别优化
if (isAndroid) {
    // 添加一个全局的触摸事件监听器，确保触摸事件能被正确处理
    document.addEventListener('DOMContentLoaded', function() {
        // 强制重绘以解决某些安卓浏览器的渲染问题
        setTimeout(function() {
            document.body.style.display = 'none';
            document.body.offsetHeight; // 触发重绘
            document.body.style.display = 'flex';
        }, 100);
    });
    
    // 处理安卓浏览器的点击延迟
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', function() {}, {passive: true});
    }
}

// 防止双击缩放
let lastTap = 0;
document.addEventListener('touchend', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
        e.preventDefault();
    }
    lastTap = currentTime;
}, false);

// 处理键盘弹出
if (isMobile) {
    window.addEventListener('resize', function() {
        if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') {
            window.setTimeout(function() {
                document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    });
}

// 添加一个全局错误处理
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// 确保语音合成API可用性检查
function checkSpeechSynthesis() {
    if (!('speechSynthesis' in window)) {
        console.warn('Speech Synthesis API not supported');
        // 隐藏语音相关按钮
        if (playBtn) playBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'none';
    }
}

// 在初始化时检查语音支持
document.addEventListener('DOMContentLoaded', checkSpeechSynthesis);
