"use strict";

let gamePattern, playerPattern, level, gameMode, disableClicks;

const gameContainerEl = document.querySelector(".game");
const explContainerEl = document.querySelector(".expl");

const lvlEl = document.querySelector(".lvl");
const maxLvlEl = document.querySelector(".max-lvl");

const nextLevelBtn = document.querySelector(".btn-next-level");

const chooseModeEl = document.querySelector(".choose-mode");
const modeOptionEl = document.querySelector(".mode-option");
const showPatternBtnEl = document.querySelector(".show-pattern");

chooseModeEl.addEventListener("click", function (e) {
  const choice = e.target;
  if (!choice.classList.contains("mode")) return;
  gameMode = choice.dataset.mode.toUpperCase();

  modeOptionEl.textContent = gameMode;
  explContainerEl.classList.add("hide");
  showPatternBtnEl.classList.remove("hide");
  gameContainerEl.classList.remove("hide");

  startGame();
});

function startGame() {
  level = 0;
  gamePattern = [];

  startNextLevel();
}

function startNextLevel() {
  level++;
  playerPattern = [];
  lvlEl.textContent = level;
  if (maxLvlEl <= lvlEl) maxLvlEl.textContent = level;

  addToPattern();
  showPattern();
}

function addToPattern() {
  const number = Math.floor(Math.random() * 4 + 1);
  const btnEl = document.querySelector(`[data-id="${number}"]`);
  gamePattern.push(btnEl);
}

async function showPattern() {
  disableClicks = true;
  gameContainerEl.style.backgroundColor = "#000";
  if (gameMode === "EASY") {
    for (let i = 0; i < gamePattern.length; i++) {
      await waiting(0.5);
      gamePattern[i].classList.add("light-up");
      await waiting(0.3);
      gamePattern[i].classList.remove("light-up");
    }
  } else {
    await waiting(0.5);
    gamePattern[gamePattern.length - 1].classList.add("light-up");
    await waiting(0.3);
    gamePattern[gamePattern.length - 1].classList.remove("light-up");
  }
  gameContainerEl.style.backgroundColor = "#fff";

  disableClicks = false;
}

function waiting(sec) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(1);
    }, sec * 1000)
  );
}

showPatternBtnEl.addEventListener("click", function () {
  if (disableClicks) return;
  showPattern();
});

gameContainerEl.addEventListener("click", manageGameClicks);

async function manageGameClicks(e) {
  if (disableClicks) return;
  const clicked = e.target;
  if (!clicked.classList.contains("game-btn")) return;
  clicked.classList.add("light-up");
  await waiting(0.3);
  clicked.classList.remove("light-up");
  playerPattern.push(clicked);

  for (let i = 0; i < playerPattern.length; i++) {
    if (playerPattern[i] === gamePattern[i]) {
      if (gamePattern.length - 1 === i) {
        await waiting(0.3);
        nextLevelBtn.classList.remove("hide");
        gameContainerEl.removeEventListener("click", manageGameClicks);
      }
    } else {
      endGame();
    }
  }
}

nextLevelBtn.addEventListener("click", function () {
  nextLevelBtn.classList.add("hide");
  startNextLevel();
  gameContainerEl.addEventListener("click", manageGameClicks);
});

function endGame() {
  lvlEl.textContent = 0;
  modeOptionEl.textContent = "";
  editEndGameMessage();
  gameContainerEl.classList.add("hide");
  showPatternBtnEl.classList.add("hide");
  explContainerEl.classList.remove("hide");
}

function editEndGameMessage() {
  const heading = document.querySelector(".msg-heading");
  const rules = document.querySelector(".rules");
  heading.textContent = `Congrats you reached level ${level}`;
  rules.textContent = `You did a great job, but you shure can do better. Give it another try.`;
}
