const bins = [
  { name: "Compost", key: "compost", hex: "#1f9c6b" },
  { name: "Recycle", key: "recycle", hex: "#2666ff" },
  { name: "Landfill", key: "landfill", hex: "#e3433b" },
];

const items = [
  { name: "Banana Peel", emoji: "🍌", bin: "compost" },
  { name: "Apple Core", emoji: "🍎", bin: "compost" },
  { name: "Eggshells", emoji: "🥚", bin: "compost" },
  { name: "Coffee Grounds", emoji: "☕", bin: "compost" },
  { name: "Paper Towel", emoji: "🧻", bin: "compost" },
  { name: "Plastic Bottle", emoji: "🧴", bin: "recycle" },
  { name: "Aluminum Can", emoji: "🥫", bin: "recycle" },
  { name: "Glass Jar", emoji: "🫙", bin: "recycle" },
  { name: "Cardboard Box", emoji: "📦", bin: "recycle" },
  { name: "Paper (Clean)", emoji: "📄", bin: "recycle" },
  { name: "Chips Wrapper", emoji: "🍟", bin: "landfill" },
  { name: "Plastic Straw", emoji: "🥤", bin: "landfill" },
  { name: "Styrofoam Cup", emoji: "🥛", bin: "landfill" },
  { name: "Greasy Pizza Box", emoji: "🍕📦", bin: "landfill" },
  { name: "Broken Ceramic", emoji: "🏺", bin: "landfill" },
];

const itemCard = document.getElementById("itemCard");
const itemOrb = document.getElementById("itemOrb");
const itemColor = document.getElementById("itemColor");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const roundEl = document.getElementById("round");
const timeEl = document.getElementById("timeLeft");
const highScoreEl = document.getElementById("highScore");
const toast = document.getElementById("toast");
const shuffleBtn = document.getElementById("shuffle");
const resetBtn = document.getElementById("reset");
const boxesWrap = document.querySelector(".boxes");
const boxes = Array.from(document.querySelectorAll(".box"));

let currentItem = items[0];
let score = 0;
let streak = 0;
let round = 1;
let timeLeft = 60;
let timerId = null;
let gameActive = false;
let timerStarted = false;
let audioReady = false;

const HIGH_SCORE_KEY = "colorSortHighScore";
const loadHighScore = () => Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
const saveHighScore = (value) => localStorage.setItem(HIGH_SCORE_KEY, String(value));
let highScore = loadHighScore();

const randomItem = () => items[Math.floor(Math.random() * items.length)];

const setItem = (item) => {
  currentItem = item;
  itemOrb.style.background = "#101415";
  itemOrb.textContent = item.emoji || "❓";
  itemColor.textContent = item.name.toUpperCase();
  itemCard.classList.remove("pop");
  void itemCard.offsetWidth;
  itemCard.classList.add("pop");
  boxesWrap.classList.remove("pop");
  void boxesWrap.offsetWidth;
  boxesWrap.classList.add("pop");
};

const updateStats = () => {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  roundEl.textContent = round;
  timeEl.textContent = timeLeft;
  highScoreEl.textContent = highScore;
};

const showToast = (message, positive) => {
  toast.textContent = message;
  toast.style.borderColor = positive ? "rgba(31, 156, 107, 0.4)" : "rgba(227, 67, 59, 0.4)";
  toast.style.color = positive ? "#1f9c6b" : "#c2362f";
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 900);
};

const playTone = (frequency, duration, type = "sine") => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!playTone.ctx) playTone.ctx = new AudioCtx();
    const ctx = playTone.ctx;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // Audio is optional; ignore failures.
  }
};

const soundCorrect = () => playTone(880, 0.12, "triangle");
const soundWrong = () => playTone(220, 0.2, "sawtooth");
const soundEnd = () => {
  playTone(660, 0.12, "triangle");
  setTimeout(() => playTone(440, 0.16, "triangle"), 120);
  setTimeout(() => playTone(330, 0.22, "triangle"), 260);
};
const soundTick = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!soundTick.ctx) soundTick.ctx = new AudioCtx();
    const ctx = soundTick.ctx;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(360, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  } catch (err) {
    // Optional.
  }
};

const handleChoice = (choice) => {
  if (!gameActive) return;
  if (!timerStarted) {
    timerStarted = true;
    startTimer();
    audioReady = true;
  }
  if (choice === currentItem.bin) {
    score += 10 + streak * 2;
    streak += 1;
    if (audioReady) soundCorrect();
    showToast("Nice! +" + (10 + (streak - 1) * 2), true);
  } else {
    score = Math.max(0, score - 4);
    streak = 0;
    if (audioReady) soundWrong();
    showToast("Miss! -4", false);
  }
  round += 1;
  updateStats();
  setItem(randomItem());
};

const stopGame = () => {
  gameActive = false;
  window.clearInterval(timerId);
  timerId = null;
  if (score > highScore) {
    highScore = score;
    saveHighScore(highScore);
  }
  updateStats();
  if (audioReady) soundEnd();
  alert("Time! Final score: " + score);
};

const startTimer = () => {
  window.clearInterval(timerId);
  timerId = window.setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      updateStats();
      stopGame();
      return;
    }
    if (timeLeft <= 10 && audioReady) {
      soundTick();
    }
    updateStats();
  }, 1000);
};

const startGame = () => {
  score = 0;
  streak = 0;
  round = 1;
  timeLeft = 60;
  gameActive = true;
  timerStarted = false;
  updateStats();
  setItem(randomItem());
};

const resetGame = () => {
  startGame();
};

updateStats();
setItem(randomItem());
startGame();

shuffleBtn.addEventListener("click", () => {
  if (!gameActive) return;
  setItem(randomItem());
});
resetBtn.addEventListener("click", resetGame);

boxes.forEach((box) => {
  box.addEventListener("click", () => handleChoice(box.dataset.color));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "c") handleChoice("compost");
  if (event.key === "r") handleChoice("recycle");
  if (event.key === "l") handleChoice("landfill");
});
