import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.47;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2;
const DUCK_FRAME_COUNT = 2;
const FRAME_TIME = 100;
const SWITCH_SPRITE_INTERVAL = 200; 

let isJumping;
let isDucking;
let dinoFrame;
let duckFrame;
let currentFrameTime;
let yVelocity;

export function setupDino() {
  isJumping = false;
  isDucking = false;
  dinoFrame = 0;
  duckFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElem, "--bottom", 0);
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);
  document.removeEventListener("keyup", onStopDucking);
  document.addEventListener("keyup", onStopDucking);
  document.removeEventListener("keydown", onDuck);
  document.addEventListener("keydown", onDuck);
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
  handleDuck(delta, speedScale);
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
  dinoElem.src = "assets/dino-lose.png";
}

function handleRun(delta, speedScale) {
  if (isJumping || isDucking) {
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = `assets/dino-run-${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

function handleDuck(delta, speedScale) {
  if (isDucking) {
    const elapsed = parseFloat(dinoElem.dataset.elapsed || 0) + delta * speedScale;
    if (elapsed >= SWITCH_SPRITE_INTERVAL) {
      if (dinoElem.src.includes("dino-duck-1.png")) {
        dinoElem.src = "assets/dino-duck.png";
      } else {
        dinoElem.src = "assets/dino-duck-1.png";
      }
      dinoElem.dataset.elapsed = 0;
    } else {
      dinoElem.dataset.elapsed = elapsed;
    }
  } else {
    dinoElem.dataset.elapsed = 0;
  }
}

function onJump(e) {
  if (e.code !== "Space" || isJumping || isDucking) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
}

function onDuck(e) {
  if (e.code !== "ArrowDown" || isJumping || isDucking) return;

  isDucking = true;
  dinoElem.classList.add("dino-ducking");
  dinoElem.src = "assets/dino-duck.png"; 
}

function onStopDucking(e) {
  if (e.code !== "ArrowDown" || !isDucking) return;

  isDucking = false;
  dinoElem.classList.remove("dino-ducking");
  dinoElem.src = `assets/dino-stationary.png`;
}