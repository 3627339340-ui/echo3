const envelope = document.getElementById("envelope");
const title = document.getElementById("title");
const replyContainer = document.getElementById("replyContainer");
const userInput = document.getElementById("userInput");
const replyBox = document.getElementById("replyBox");
const form = document.getElementById("messageForm");

setTimeout(() => {
  openEnvelope();
}, 3000);

envelope?.addEventListener("click", openEnvelope);

function openEnvelope() {
  envelope.style.display = "none";
  form.style.display = "flex";
  title.textContent = "写给未来的信 💌";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const prompt = userInput.value.trim();
  if (!prompt) return;
  form.style.display = "none";
  replyContainer.style.display = "block";
  replyBox.textContent = "💭 正在生成来自未来的回信...";

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();

  replyBox.textContent = data.reply;
});

document.getElementById("closeReply").addEventListener("click", () => {
  replyContainer.style.display = "none";
  form.style.display = "flex";
});
