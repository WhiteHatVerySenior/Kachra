// Added extended list of items
// Added 5 dustbins instead of 3, which made the game easier and high scoring
// Added meme sounds
// Changed the layout a litte bit
const bins = [
  { name: "Wet", key: "wet", hex: "#1f9c6b" },
  { name: "Dry", key: "dry", hex: "#2666ff" },
  { name: "Hazard", key: "hazard", hex: "#e3433b" },
  { name: "Reject", key: "reject", hex: "#101415" },
  { name: "E-waste", key: "ewaste", hex: "#cfcfcf" },
];

const items = [
  { name: "Vegetable Peels", emoji: "🥕", bin: "wet" },
  { name: "Fruit Peels", emoji: "🍌", bin: "wet" },
  { name: "Leftover Food", emoji: "🍛", bin: "wet" },
  { name: "Roti / Rice / Dal", emoji: "🍚", bin: "wet" },
  { name: "Egg Shells", emoji: "🥚", bin: "wet" },
  { name: "Tea Leaves", emoji: "🍵", bin: "wet" },
  { name: "Tea Bag (Paper Only)", emoji: "🫖", bin: "wet" },
  { name: "Flowers", emoji: "💐", bin: "wet" },
  { name: "Garden Leaves", emoji: "🍃", bin: "wet" },
  { name: "Newspaper", emoji: "📰", bin: "dry" },
  { name: "Office Paper", emoji: "📄", bin: "dry" },
  { name: "Cardboard Box", emoji: "📦", bin: "dry" },
  { name: "Clean Pizza Box (Top)", emoji: "📦", bin: "dry" },
  { name: "Oily Pizza Box (Bottom)", emoji: "🧻", bin: "reject" },
  { name: "Plastic Bottle", emoji: "🧴", bin: "dry" },
  { name: "Old Shampoo Bottle", emoji: "🧴", bin: "dry" },
  { name: "Empty Mosquito Repellent Bottle", emoji: "🧴", bin: "dry" },
  { name: "Milk Packet (Washed)", emoji: "🥛", bin: "dry" },
  { name: "Chips Packet (Clean)", emoji: "🍟", bin: "reject" },
  { name: "Chocolate Wrapper", emoji: "🍫", bin: "reject" },
  { name: "Plastic Straw", emoji: "🥤", bin: "reject" },
  { name: "Styrofoam Cup", emoji: "🥛", bin: "reject" },
  { name: "Broken Ceramic", emoji: "🏺", bin: "reject" },
  { name: "Used Pen", emoji: "🖊️", bin: "reject" },
  { name: "Used Garments", emoji: "👕", bin: "reject" },
  { name: "Broken Phone Cover", emoji: "📱", bin: "reject" },
  { name: "Cigarette Butts", emoji: "🚬", bin: "reject" },
  { name: "Soiled Aluminum Foil", emoji: "🥫", bin: "reject" },
  { name: "Dust", emoji: "🌫️", bin: "reject" },
  { name: "Metal Can", emoji: "🥫", bin: "dry" },
  { name: "Clean Aluminum Foil", emoji: "🥫", bin: "dry" },
  { name: "Glass Bottle", emoji: "🍾", bin: "dry" },
  { name: "Broken Glass (Wrapped in Paper)", emoji: "🧪", bin: "dry" },
  { name: "Thermocol", emoji: "🧊", bin: "reject" },
  { name: "Used Tissue (Soiled)", emoji: "🧻", bin: "wet" },
  { name: "Paper Napkin (Oily)", emoji: "🧻", bin: "wet" },
  { name: "Sanitary Pad", emoji: "🧷", bin: "hazard" },
  { name: "Diaper", emoji: "🍼", bin: "hazard" },
  { name: "Razor Blade", emoji: "🪒", bin: "hazard" },
  { name: "Old Knife", emoji: "🔪", bin: "hazard" },
  { name: "Used Mask", emoji: "😷", bin: "hazard" },
  { name: "Expired Medicines", emoji: "💊", bin: "hazard" },
  { name: "Empty Mosquito Repellent Spray Can", emoji: "🧯", bin: "hazard" },
  { name: "Battery", emoji: "🔋", bin: "ewaste" },
  { name: "Mobile Phone", emoji: "📱", bin: "ewaste" },
  { name: "Charger / Wires", emoji: "🔌", bin: "ewaste" },
  { name: "CFL / Tube Light", emoji: "💡", bin: "ewaste" },
];

const itemCard = document.getElementById("itemCard");
const itemOrb = document.getElementById("itemOrb");
const itemColor = document.getElementById("itemColor");
const itemCounter = document.getElementById("itemCounter");
const itemTimer = document.getElementById("itemTimer");
const practiceScoreRow = document.getElementById("practiceScoreRow");
const practiceScoreNow = document.getElementById("practiceScoreNow");
const practiceScoreHigh = document.getElementById("practiceScoreHigh");
let practiceHighRemote = 0;
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const roundEl = document.getElementById("round");
const timeEl = document.getElementById("timeLeft");
const highScoreEl = document.getElementById("highScore");
const historyList = document.getElementById("historyList");
const timeStat = document.getElementById("timeStat");
const scoreboard = document.querySelector(".scoreboard");
const toast = document.getElementById("toast");
const shuffleBtn = document.getElementById("shuffle");
const styleToggleBtn = document.getElementById("styleToggle");
const changeProfileBtn = document.getElementById("changeProfile");
const backToTestBtn = document.getElementById("backToTest");
const memeModeBtn = document.getElementById("memeMode");
const scoresLink = document.getElementById("scoresLink");
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
let testWrong = 0;
let memeMode = true;
let fillStyleIndex = 0;
const fillStyles = ["overlay", "stack", "bar"];
const maxFill = 5;
const binFill = {
  wet: 0,
  dry: 0,
  hazard: 0,
  reject: 0,
  ewaste: 0,
};
const binScores = {
  wet: 0,
  dry: 0,
  hazard: 0,
  reject: 0,
  ewaste: 0,
};
let lastLearningIndex = -1;
let practiceAttempts = 0;
let consecutiveWrong = 0;

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
const endModal = document.getElementById("endModal");
const civicScoreEl = document.getElementById("civicScore");
const startPracticeBtn = document.getElementById("startPractice");
const stage = document.querySelector(".stage");
const shareScoreBtn = document.getElementById("shareScore");
const saveStatusTest = document.getElementById("saveStatusTest");
const practiceEndModal = document.getElementById("practiceEndModal");
const practiceScoreEl = document.getElementById("practiceScore");
const practiceAgainBtn = document.getElementById("practiceAgain");
const learningPointEl = document.getElementById("learningPoint");
const saveStatusPractice = document.getElementById("saveStatusPractice");

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
let currentProfile = loadProfile();

const randomItem = () => items[Math.floor(Math.random() * items.length)];
const shuffledItems = () => {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
let testItems = [];

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
  if (itemCounter) {
    if (mode === "test") {
      const total = testItems.length || items.length;
      itemCounter.textContent = `${Math.min(testIndex + 1, total)} / ${total}`;
    } else {
      itemCounter.textContent = "";
    }
  }
  if (itemTimer) {
    if (mode === "game") {
      itemTimer.style.display = "block";
      itemTimer.textContent = `${timeLeft}s`;
    } else {
      itemTimer.style.display = "none";
      itemTimer.textContent = "";
    }
  }
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
  if (itemTimer) {
    itemTimer.textContent = mode === "game" ? `${timeLeft}s` : "--";
  }
  highScoreEl.textContent = highScore;
  if (practiceScoreRow) {
    if (mode === "game") {
      practiceScoreRow.style.display = "flex";
      if (practiceScoreNow) practiceScoreNow.textContent = `Score: ${score}`;
      if (practiceScoreHigh) practiceScoreHigh.textContent = `High: ${practiceHighRemote}`;
    } else {
      practiceScoreRow.style.display = "none";
    }
  }
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
const wrongSounds = [
  new Audio("assets/sfx/abe-sale-harmonium-cut.mp3"),
  new Audio("assets/sfx/aayein-baigan-finalCut.mp3"),
];
wrongSounds.forEach((audio) => {
  audio.preload = "auto";
});
const practiceEndSounds = [
  new Audio("assets/sfx/khatam-ho-gaya-bhaiya-matter-puneet-superstar-audio-meme.mp3"),
  new Audio("assets/sfx/7-crore-audio-meme-download.mp3"),
];
practiceEndSounds.forEach((audio) => {
  audio.preload = "auto";
});
const doubleWrongSound = new Audio("assets/sfx/yaaa-puneet-superstar-indian-meme.mp3");
doubleWrongSound.preload = "auto";
const soundWrong = () => {
  if (memeMode) {
    const pick = wrongSounds[Math.floor(Math.random() * wrongSounds.length)];
    pick.currentTime = 0;
    pick.play().catch(() => {});
  } else {
    playTone(220, 0.2, "sawtooth");
  }
};
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
  if (memeMode && !doubleWrongSound.paused) {
    doubleWrongSound.pause();
    doubleWrongSound.currentTime = 0;
  }
  if (mode === "test") {
    if (choice === currentItem.bin) {
      testCorrect += 1;
    } else {
      testWrong += 1;
    }
    testIndex += 1;
    round = Math.min(testIndex + 1, testItems.length);
    if (testIndex >= testItems.length) {
      endTest();
      return;
    }
    updateStats();
    setItem(testItems[testIndex]);
    return;
  }

  if (!timerStarted) {
    timerStarted = true;
    startTimer();
    audioReady = true;
  }
  practiceAttempts += 1;
  if (choice === currentItem.bin) {
    consecutiveWrong = 0;
    binScores[choice] += 10;
    score = binScores.wet + binScores.dry + binScores.hazard + binScores.reject + binScores.ewaste;
    updateBinScores();
    if (mode === "game") {
      updateBinFill(choice);
    }
    if (audioReady) soundCorrect();
    showToast("Nice! +10", true);
  } else {
    consecutiveWrong += 1;
    binScores[choice] = 0;
    score = binScores.wet + binScores.dry + binScores.hazard + binScores.reject + binScores.ewaste;
    updateBinScores();
    resetBinFill(choice);
    const wrongBox = boxes.find((b) => b.dataset.color === choice);
    if (wrongBox) {
      wrongBox.classList.remove("shake");
      void wrongBox.offsetWidth;
      wrongBox.classList.add("shake");
    }
    if (audioReady) {
      if (memeMode && consecutiveWrong >= 2) {
        doubleWrongSound.currentTime = 0;
        doubleWrongSound.play().catch(() => {});
        consecutiveWrong = 0;
      } else {
        soundWrong();
      }
    }
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
  if (audioReady) {
    const maxPossible = practiceAttempts * 10;
    const percent = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
    if (percent < 90 && practiceEndSounds.length > 0) {
      const pick = practiceEndSounds[Math.floor(Math.random() * practiceEndSounds.length)];
      pick.currentTime = 0;
      pick.play().catch(() => {});
    } else {
      soundEnd();
    }
  }
  if (practiceScoreEl) practiceScoreEl.textContent = String(score);
  if (learningPointEl) learningPointEl.textContent = randomLearningPoint();
  if (window.firebaseAddScore) {
    window.firebaseAddScore({
      mode: "practice",
      score,
      attempts: practiceAttempts,
      name: currentProfile?.name || "",
      age: currentProfile?.age || "",
    })
      .then(() => {
        showToast("Score saved", true);
        if (saveStatusPractice) saveStatusPractice.textContent = "Score saved";
      })
      .catch(() => {
        showToast("Save failed", false);
        if (saveStatusPractice) saveStatusPractice.textContent = "Save failed";
      });
  } else if (saveStatusPractice) {
    saveStatusPractice.textContent = "Firebase not loaded";
  }
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
  consecutiveWrong = 0;
  practiceAttempts = 0;
  binFill.wet = 0;
  binFill.dry = 0;
  binFill.hazard = 0;
  binFill.reject = 0;
  binFill.ewaste = 0;
  binScores.wet = 0;
  binScores.dry = 0;
  binScores.hazard = 0;
  binScores.reject = 0;
  binScores.ewaste = 0;
  boxes.forEach((box) => {
    box.style.setProperty("--fill", "0%");
    const stack = box.querySelector(".trash-stack");
    if (stack) stack.innerHTML = "";
  });
  if (timeStat) timeStat.classList.remove("hidden");
  if (shuffleBtn) shuffleBtn.classList.remove("hidden");
  if (styleToggleBtn) styleToggleBtn.classList.remove("hidden");
  if (changeProfileBtn) changeProfileBtn.classList.remove("hidden");
  if (backToTestBtn) backToTestBtn.classList.remove("hidden");
  if (resetBtn) resetBtn.classList.remove("hidden");
  if (scoreboard) scoreboard.classList.add("hidden");
  if (stage) {
    stage.classList.remove("test-mode");
    stage.classList.add("practice-mode");
  }
  if (stage) stage.classList.remove("profile-active");
  if (scoresLink) scoresLink.href = "scores.html?mode=practice";
  updateStats();
  updateBinScores();
  setItem(randomItem());
  if (itemCounter) itemCounter.textContent = "";
  practiceHighRemote = 0;
  if (practiceScoreHigh) practiceScoreHigh.textContent = `High: ${practiceHighRemote}`;
  if (window.firebaseGetPracticeHigh) {
    window.firebaseGetPracticeHigh()
      .then((value) => {
        practiceHighRemote = value;
        if (practiceScoreHigh) practiceScoreHigh.textContent = `High: ${practiceHighRemote}`;
      })
      .catch(() => {});
  }
};

const startTest = () => {
  mode = "test";
  gameActive = true;
  timerStarted = false;
  audioReady = false;
  window.clearInterval(timerId);
  timerId = null;
  testIndex = 0;
  testItems = shuffledItems();
  testCorrect = 0;
  testWrong = 0;
  score = 0;
  streak = 0;
  round = 1;
  binScores.wet = 0;
  binScores.dry = 0;
  binScores.hazard = 0;
  binScores.reject = 0;
  binScores.ewaste = 0;
  updateBinScores();
  if (timeStat) timeStat.classList.add("hidden");
  if (shuffleBtn) shuffleBtn.classList.add("hidden");
  if (styleToggleBtn) styleToggleBtn.classList.add("hidden");
  if (changeProfileBtn) changeProfileBtn.classList.remove("hidden");
  if (backToTestBtn) backToTestBtn.classList.add("hidden");
  if (resetBtn) resetBtn.classList.add("hidden");
  if (scoreboard) scoreboard.classList.add("hidden");
  if (stage) {
    stage.classList.remove("practice-mode");
    stage.classList.add("test-mode");
  }
  if (stage) stage.classList.remove("profile-active");
  if (scoresLink) scoresLink.href = "scores.html?mode=test";
  updateStats();
  setItem(testItems[testIndex]);
};

const endTest = () => {
  gameActive = false;
  const total = testItems.length || items.length;
  const raw = testCorrect - 2 * testWrong;
  const percent = Math.round((raw / total) * 100);
  if (civicScoreEl) {
    civicScoreEl.textContent = percent + " / 100";
  }
  const resultLine = document.getElementById("testResultLine");
  if (resultLine) {
    resultLine.textContent =
      percent < 15
        ? "Somalian Pirates have better Civic Sense than you. Your score"
        : percent < 30
          ? "A retard monkey would have scored better than you. Your \"Civic\" Sense Score:"
          : "Great effort! Your score:";
  }
  if (shareScoreBtn) {
    shareScoreBtn.textContent =
      percent < 80
        ? "Share your score with others, lekin waise ye dikhane layak score hai nahi"
        : "Share your score with others";
  }
  if (window.firebaseAddScore) {
    window.firebaseAddScore({
      mode: "test",
      score: percent,
      name: currentProfile?.name || "",
      age: currentProfile?.age || "",
    })
      .then(() => {
        showToast("Score saved", true);
        if (saveStatusTest) saveStatusTest.textContent = "Score saved";
      })
      .catch(() => {
        showToast("Save failed", false);
        if (saveStatusTest) saveStatusTest.textContent = "Save failed";
      });
  } else if (saveStatusTest) {
    saveStatusTest.textContent = "Firebase not loaded";
  }
  if (endModal) endModal.classList.remove("hidden");
};

const resetGame = () => {
  startGame();
};

updateStats();
renderHistory();
applyFillStyle();

const params = new URLSearchParams(window.location.search);
const returnMode = params.get("mode");
if (returnMode === "practice") {
  if (profileModal) profileModal.classList.add("hidden");
  startGame();
} else if (returnMode === "test") {
  if (profileModal) profileModal.classList.add("hidden");
  startTest();
} else {
  gameActive = false;
  if (stage) stage.classList.add("profile-active");
  if (profileModal) profileModal.classList.remove("hidden");
}

if (profileForm) {
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const profileData = {
      name: playerName.value.trim(),
      age: playerAge.value,
      gender: "",
      city: "",
      language: "",
    };
    if (
      !profileData.name ||
      !profileData.age ||
      !profileData.age
    )
      return;
    saveProfile(profileData);
    currentProfile = profileData;
    if (profileModal) profileModal.classList.add("hidden");
    if (stage) stage.classList.remove("profile-active");
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
    currentProfile = null;
    if (stage) stage.classList.add("profile-active");
    if (profileModal) profileModal.classList.remove("hidden");
    gameActive = false;
  });
}

if (backToTestBtn) {
  backToTestBtn.addEventListener("click", () => {
    startTest();
  });
}

if (memeModeBtn) {
  memeModeBtn.textContent = "Meme Mode: On";
  memeModeBtn.addEventListener("click", () => {
    memeMode = !memeMode;
    memeModeBtn.textContent = memeMode ? "Meme Mode: On" : "Meme Mode: Off";
  });
}

boxes.forEach((box) => {
  box.addEventListener("click", () => handleChoice(box.dataset.color));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "w") handleChoice("wet");
  if (event.key === "d") handleChoice("dry");
  if (event.key === "h") handleChoice("hazard");
  if (event.key === "b") handleChoice("reject");
  if (event.key === "e") handleChoice("ewaste");
});
