import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const SPEED = 0.075;
const FLYING_DINO_INTERVAL_MIN = 7000;
const FLYING_DINO_INTERVAL_MAX = 15000;
const SWITCH_SPRITE_INTERVAL = 100;
const worldElem = document.querySelector("[data-world]");

let nextFlyingDinoTime;

export function setupFlyingDino() {
  nextFlyingDinoTime = FLYING_DINO_INTERVAL_MIN;
  document.querySelectorAll("[data-flying-dino]").forEach((dino) => {
    dino.remove();
  });
  console.log('Flying dino setup complete');
}

export function updateFlyingDino(delta, speedScale) {
  document.querySelectorAll("[data-flying-dino]").forEach((dino) => {
    incrementCustomProperty(dino, "--left", delta * speedScale * SPEED * 1);
    if (getCustomProperty(dino, "--left") <= -10) { 
      dino.remove();
      console.log('Flying dino removed');
    } else {
      const elapsed = parseFloat(dino.dataset.elapsed) + delta;
      if (elapsed >= SWITCH_SPRITE_INTERVAL) {
        if (dino.src.includes("burd1.png")) {
          dino.src = "assets/burd2.png";
        } else {
          dino.src = "assets/burd1.png";
        }
        dino.dataset.elapsed = 0;
        console.log('Flying dino sprite switched');
      } else {
        dino.dataset.elapsed = elapsed;
      }
    }
  });

  if (nextFlyingDinoTime <= 0) {
    createFlyingDino();
    nextFlyingDinoTime =
      randomNumberBetween(FLYING_DINO_INTERVAL_MIN, FLYING_DINO_INTERVAL_MAX) /
      speedScale;
    console.log('Next flying dino time set:', nextFlyingDinoTime);
  }
  nextFlyingDinoTime -= delta;
}

export function getFlyingDinoRects() {
  return [...document.querySelectorAll("[data-flying-dino]")].map((dino) => {
    return dino.getBoundingClientRect();
  });
}

function createFlyingDino() {
  const dino = document.createElement("img");
  dino.dataset.flyingDino = true;
  dino.dataset.elapsed = 0;
  dino.src = "assets/burd1.png";
  dino.classList.add("flying-dino");
  setCustomProperty(dino, "--right", 100); 
  setCustomProperty(dino, "--top", randomNumberBetween(5, 20));
  worldElem.append(dino);
  console.log('Flying dino created at top:', getCustomProperty(dino, "--top"));
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
