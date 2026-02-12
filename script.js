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
  {
    name: "Greasy Pizza Box",
    image: "https://freesvg.org/download/194337",
    bin: "landfill",
  },
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
const historyList = document.getElementById("historyList");
const timeStat = document.getElementById("timeStat");
const toast = document.getElementById("toast");
const shuffleBtn = document.getElementById("shuffle");
const styleToggleBtn = document.getElementById("styleToggle");
const changeProfileBtn = document.getElementById("changeProfile");
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
let mode = "test";
let testIndex = 0;
let testCorrect = 0;
let fillStyleIndex = 0;
const fillStyles = ["overlay", "stack", "bar"];
const maxFill = 5;
const binFill = {
  compost: 0,
  recycle: 0,
  landfill: 0,
};
const binScores = {
  compost: 0,
  recycle: 0,
  landfill: 0,
};
let lastLearningIndex = -1;

const HIGH_SCORE_KEY = "colorSortHighScore";
const HISTORY_KEY = "colorSortHistory";
const PROFILE_KEY = "colorSortProfile";
const loadHighScore = () => Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
const saveHighScore = (value) => localStorage.setItem(HIGH_SCORE_KEY, String(value));
let highScore = loadHighScore();
const loadHistory = () => {
  try {
    const data = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
};
const saveHistory = (history) => localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
let history = loadHistory();

const profileModal = document.getElementById("profileModal");
const profileForm = document.getElementById("profileForm");
const playerName = document.getElementById("playerName");
const playerAge = document.getElementById("playerAge");
const playerGender = document.getElementById("playerGender");
const playerCity = document.getElementById("playerCity");
const playerLanguage = document.getElementById("playerLanguage");
const endModal = document.getElementById("endModal");
const civicScoreEl = document.getElementById("civicScore");
const startPracticeBtn = document.getElementById("startPractice");
const shareScoreBtn = document.getElementById("shareScore");
const practiceEndModal = document.getElementById("practiceEndModal");
const practiceScoreEl = document.getElementById("practiceScore");
const practiceAgainBtn = document.getElementById("practiceAgain");
const learningPointEl = document.getElementById("learningPoint");

const learningPoints = [
  "Wrong Answer makes basket score ZERO because ek galat kachre se garbage colletion ka entire batch kharab ho jata hai!",
  "Decision time itna kam hona chahea ke kabhi galti na ho",
  "Remember it as, wet garbage smells, dry garbage sells, landfill garbage harms",
  "Segregated waste has a value, mixed waste has only cost.",
  "Correct your misconceptions and educate others as well",
  "No matter what, Plastic NEVER goes into Wet Waste",
  "Ye tere chips, biscuit ke wrappers recyclable nahi hote! Sab landfill me jata hai!!",
  "This is Civic Sense Chapter 1, desh ye complete karle fir apan or bhi kaam karenge",
  "han pata hai dusbins nahi hai desh me, but pehle tu seekh to le, fir apan dustbin bhi lagwaenge",
];

const randomLearningPoint = () => {
  if (learningPoints.length === 0) return "";
  let index = Math.floor(Math.random() * learningPoints.length);
  if (learningPoints.length > 1) {
    while (index === lastLearningIndex) {
      index = Math.floor(Math.random() * learningPoints.length);
    }
  }
  lastLearningIndex = index;
  return learningPoints[index];
};

const loadProfile = () => {
  try {
    const data = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    return data && data.name ? data : null;
  } catch (err) {
    return null;
  }
};

const saveProfile = (profile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

const randomItem = () => items[Math.floor(Math.random() * items.length)];

const setItem = (item) => {
  currentItem = item;
  if (item.image) {
    itemOrb.textContent = "";
    itemOrb.style.background = "#ffffff";
    itemOrb.style.backgroundImage = `url("${item.image}")`;
    itemOrb.style.backgroundSize = "contain";
    itemOrb.style.backgroundRepeat = "no-repeat";
    itemOrb.style.backgroundPosition = "center";
  } else {
    itemOrb.style.background = "#101415";
    itemOrb.style.backgroundImage = "none";
    itemOrb.textContent = item.emoji || "❓";
  }
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
  timeEl.textContent = mode === "game" ? timeLeft : "--";
  highScoreEl.textContent = highScore;
};

const updateBinScores = () => {
  boxes.forEach((box) => {
    const binKey = box.dataset.color;
    const scoreEl = box.querySelector(".bin-score");
    if (scoreEl) scoreEl.textContent = String(binScores[binKey] || 0);
  });
};

const applyFillStyle = () => {
  if (!boxesWrap) return;
  boxesWrap.dataset.fillStyle = fillStyles[fillStyleIndex];
};

const updateBinFill = (binKey) => {
  const box = boxes.find((b) => b.dataset.color === binKey);
  if (!box) return;
  binFill[binKey] = Math.min(maxFill, binFill[binKey] + 1);
  const percent = Math.round((binFill[binKey] / maxFill) * 100) + "%";
  box.style.setProperty("--fill", percent);
  if (boxesWrap.dataset.fillStyle === "stack") {
    const stack = box.querySelector(".trash-stack");
    if (stack) {
      stack.innerHTML = "";
      for (let i = 0; i < binFill[binKey]; i += 1) {
        const span = document.createElement("span");
        span.textContent = "🗑️";
        stack.appendChild(span);
      }
    }
  }
};

const resetBinFill = (binKey) => {
  const box = boxes.find((b) => b.dataset.color === binKey);
  if (!box) return;
  binFill[binKey] = 0;
  box.style.setProperty("--fill", "0%");
  const stack = box.querySelector(".trash-stack");
  if (stack) stack.innerHTML = "";
};

const renderHistory = () => {
  if (!historyList) return;
  historyList.innerHTML = "";
  const recent = history.slice(0, 5);
  if (recent.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No scores yet";
    historyList.appendChild(li);
    return;
  }
  recent.forEach((entry) => {
    const li = document.createElement("li");
    const scoreSpan = document.createElement("span");
    scoreSpan.textContent = String(entry.score);
    const timeSpan = document.createElement("span");
    timeSpan.textContent = entry.time;
    li.appendChild(scoreSpan);
    li.appendChild(timeSpan);
    historyList.appendChild(li);
  });
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
  if (mode === "test") {
    if (choice === currentItem.bin) {
      testCorrect += 1;
    }
    testIndex += 1;
    round = Math.min(testIndex + 1, items.length);
    if (testIndex >= items.length) {
      endTest();
      return;
    }
    updateStats();
    setItem(items[testIndex]);
    return;
  }

  if (!timerStarted) {
    timerStarted = true;
    startTimer();
    audioReady = true;
  }
  if (choice === currentItem.bin) {
    binScores[choice] += 10;
    score = binScores.compost + binScores.recycle + binScores.landfill;
    updateBinScores();
    if (mode === "game") {
      updateBinFill(choice);
    }
    if (audioReady) soundCorrect();
    showToast("Nice! +10", true);
  } else {
    binScores[choice] = 0;
    score = binScores.compost + binScores.recycle + binScores.landfill;
    updateBinScores();
    resetBinFill(choice);
    const wrongBox = boxes.find((b) => b.dataset.color === choice);
    if (wrongBox) {
      wrongBox.classList.remove("shake");
      void wrongBox.offsetWidth;
      wrongBox.classList.add("shake");
    }
    if (audioReady) soundWrong();
    showToast("Wrong bin! Score reset", false);
  }
  round += 1;
  updateStats();
  setItem(randomItem());
};

const stopGame = () => {
  if (mode !== "game") return;
  gameActive = false;
  window.clearInterval(timerId);
  timerId = null;
  if (score > highScore) {
    highScore = score;
    saveHighScore(highScore);
  }
  const stamp = new Date();
  history.unshift({
    score,
    time: stamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });
  history = history.slice(0, 20);
  saveHistory(history);
  updateStats();
  renderHistory();
  if (audioReady) soundEnd();
  if (practiceScoreEl) practiceScoreEl.textContent = String(score);
  if (learningPointEl) learningPointEl.textContent = randomLearningPoint();
  if (practiceEndModal) practiceEndModal.classList.remove("hidden");
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
  mode = "game";
  score = 0;
  streak = 0;
  round = 1;
  timeLeft = 60;
  gameActive = true;
  timerStarted = false;
  audioReady = false;
  window.clearInterval(timerId);
  timerId = null;
  binFill.compost = 0;
  binFill.recycle = 0;
  binFill.landfill = 0;
  binScores.compost = 0;
  binScores.recycle = 0;
  binScores.landfill = 0;
  boxes.forEach((box) => {
    box.style.setProperty("--fill", "0%");
    const stack = box.querySelector(".trash-stack");
    if (stack) stack.innerHTML = "";
  });
  if (timeStat) timeStat.classList.remove("hidden");
  if (shuffleBtn) shuffleBtn.classList.remove("hidden");
  if (styleToggleBtn) styleToggleBtn.classList.remove("hidden");
  if (changeProfileBtn) changeProfileBtn.classList.remove("hidden");
  if (resetBtn) resetBtn.classList.remove("hidden");
  updateStats();
  updateBinScores();
  setItem(randomItem());
};

const startTest = () => {
  mode = "test";
  gameActive = true;
  timerStarted = false;
  audioReady = false;
  window.clearInterval(timerId);
  timerId = null;
  testIndex = 0;
  testCorrect = 0;
  score = 0;
  streak = 0;
  round = 1;
  binScores.compost = 0;
  binScores.recycle = 0;
  binScores.landfill = 0;
  updateBinScores();
  if (timeStat) timeStat.classList.add("hidden");
  if (shuffleBtn) shuffleBtn.classList.add("hidden");
  if (styleToggleBtn) styleToggleBtn.classList.add("hidden");
  if (changeProfileBtn) changeProfileBtn.classList.remove("hidden");
  if (resetBtn) resetBtn.classList.add("hidden");
  updateStats();
  setItem(items[testIndex]);
};

const endTest = () => {
  gameActive = false;
  const percent = Math.round((testCorrect / items.length) * 100);
  if (civicScoreEl) {
    civicScoreEl.textContent = percent + " / 100";
  }
  if (shareScoreBtn) {
    shareScoreBtn.textContent =
      percent < 80
        ? "Share your score with others, lekin waise ye dikhane layak score hai nahi"
        : "Share your score with others";
  }
  if (endModal) endModal.classList.remove("hidden");
};

const resetGame = () => {
  startGame();
};

updateStats();
renderHistory();
applyFillStyle();

const profile = loadProfile();
if (!profile) {
  gameActive = false;
  if (profileModal) profileModal.classList.remove("hidden");
}
if (profile) {
  startTest();
}

if (profileForm) {
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const profileData = {
      name: playerName.value.trim(),
      age: Number(playerAge.value),
      gender: playerGender.value,
      city: playerCity.value.trim(),
      language: playerLanguage.value,
    };
    if (
      !profileData.name ||
      !profileData.age ||
      !profileData.gender ||
      !profileData.city ||
      !profileData.language
    )
      return;
    saveProfile(profileData);
    if (profileModal) profileModal.classList.add("hidden");
    alert("Are you ready to know your Civic Sense Score?");
    startTest();
  });
}

if (startPracticeBtn) {
  startPracticeBtn.addEventListener("click", () => {
    if (endModal) endModal.classList.add("hidden");
    startGame();
  });
}

if (practiceAgainBtn) {
  practiceAgainBtn.addEventListener("click", () => {
    if (practiceEndModal) practiceEndModal.classList.add("hidden");
    startGame();
  });
}

shuffleBtn.addEventListener("click", () => {
  if (!gameActive) return;
  setItem(randomItem());
});
resetBtn.addEventListener("click", resetGame);

if (styleToggleBtn) {
  styleToggleBtn.addEventListener("click", () => {
    fillStyleIndex = (fillStyleIndex + 1) % fillStyles.length;
    applyFillStyle();
  });
}

if (changeProfileBtn) {
  changeProfileBtn.addEventListener("click", () => {
    localStorage.removeItem(PROFILE_KEY);
    if (profileModal) profileModal.classList.remove("hidden");
    gameActive = false;
  });
}

boxes.forEach((box) => {
  box.addEventListener("click", () => handleChoice(box.dataset.color));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "c") handleChoice("compost");
  if (event.key === "r") handleChoice("recycle");
  if (event.key === "l") handleChoice("landfill");
});
