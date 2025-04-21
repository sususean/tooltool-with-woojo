// Header Menu Animation
window.addEventListener("load", () => {
  const header = document.querySelector(".header");
  const inside = document.querySelector(".inside");
  const headerButton = document.querySelector(".header-button");
  const headerLogo = document.querySelector(".header-logo");

  let isOpen = false;

  function adjustMenuWidth() {
    const logoWidth = headerLogo.offsetWidth;
    const hamburgerWidth = headerButton.offsetWidth;
    const insideWidth = inside.scrollWidth;

    if (isOpen) {
      header.style.width = `${logoWidth + insideWidth + hamburgerWidth}px`;
    } else {
      header.style.width = `${logoWidth + hamburgerWidth}px`;
    }
  }

  headerButton.addEventListener("click", () => {
    isOpen = !isOpen;
    header.classList.toggle("open", isOpen);
    adjustMenuWidth();
  });

  requestAnimationFrame(() => {
    adjustMenuWidth();
    header.style.visibility = "visible";
  });
});

/***** CSS ANIMATION LIBRARY *****/

/***** UNDERLYING ANIMATION CODE *****/
const textContainer = document.getElementById("text");
const textInput = document.getElementById("textInput");
// Use the current text input value as the default text.
const defaultText = textInput.value || "Fluid";

// Function to create animated text; breaks lines only on explicit newlines.
const createWaveText = (text) => {
  textContainer.innerHTML = "";
  const lines = text.split("\n");
  lines.forEach((line) => {
    const lineDiv = document.createElement("div");
    lineDiv.style.textAlign = "center";
    lineDiv.style.margin = "0";
    lineDiv.style.lineHeight = "1";
    line.split("").forEach((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      lineDiv.appendChild(span);
    });
    textContainer.appendChild(lineDiv);
  });
};

// Create the initial animated text.
createWaveText(defaultText);

let mouseX = 0,
  mouseY = 0;

// AnimateWave responds to mouse movement or simulation events.
const animateWave = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  const letters = textContainer.querySelectorAll("span");
  letters.forEach((letter, i) => {
    const rect = letter.getBoundingClientRect();
    const dx = mouseX - (rect.left + rect.width / 2);
    const dy = mouseY - (rect.top + rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 350;
    const intensity = Math.max(0, 1 - distance / maxDistance);

    // Assign each letter a random color from the 4 possibilities,
    // caching the result so it updates at most once per second.
    let currentColor = letter.dataset.currentColor;
    const now = performance.now();
    if (
      !currentColor ||
      !letter.dataset.lastColorTime ||
      now - letter.dataset.lastColorTime > 1000
    ) {
      const colors = [
        document.getElementById("dotGrid1").value,
        document.getElementById("dotGrid2").value,
        document.getElementById("dotGrid3").value,
        document.getElementById("dotGrid4").value,
      ];
      const randomIndex = Math.floor(Math.random() * colors.length);
      currentColor = colors[randomIndex];
      letter.dataset.currentColor = currentColor;
      letter.dataset.lastColorTime = now;
    }

    const bgColorInput = document.getElementById("bgColor");
    const container = document.getElementById("container");

    bgColorInput.addEventListener("input", (e) => {
      container.style.backgroundColor = e.target.value;
    });

    gsap.to(letter, {
      y: Math.sin((i + now / 200) * 0.5) * intensity * 30,
      x: Math.sin((i + now / 300) * 0.5) * intensity * 15,
      scale: 1 + intensity * 0.4,
      filter: `blur(${2 + (15 - 2) * (1 - intensity)}px)`,
      color: currentColor,
      textShadow: `0 0 ${intensity * 50}px ${currentColor}`,
      duration: 0.3,
      ease: "sine.out",
    });
  });
};

document.addEventListener("mousemove", animateWave);

/***** TEXT INPUT FEATURE *****/
textInput.addEventListener("input", function () {
  createWaveText(this.value);
});
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    createWaveText(textInput.value);
  }
});

/***** SIMULATION CODE (Auto Animation) *****/
let isPlaying = false;
let animationId = null;
let simulationStartTime = null;

function simulateMouseMotion(timestamp) {
  if (!simulationStartTime) simulationStartTime = timestamp;
  const elapsed = (timestamp - simulationStartTime) / 1000;
  const speedControl = animationToggle.checked ? parseInt(speedBar.value) : 0;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const amplitudeX = window.innerWidth / 4;
  const amplitudeY = window.innerHeight / 20;
  const simulatedX = centerX + amplitudeX * Math.sin(elapsed * speedControl);
  const simulatedY =
    centerY + amplitudeY * Math.sin(elapsed * speedControl * 1.5);
  const simulatedEvent = { clientX: simulatedX, clientY: simulatedY };
  animateWave(simulatedEvent);
  if (isPlaying) {
    animationId = requestAnimationFrame(simulateMouseMotion);
  }
}

const animationToggle = document.getElementById("animationToggle");
const speedBar = document.getElementById("speedBar");
const speedValue = document.getElementById("speedValue");

animationToggle.addEventListener("change", () => {
  if (animationToggle.checked) {
    isPlaying = true;
    simulationStartTime = null;
    requestAnimationFrame(simulateMouseMotion);
  } else {
    isPlaying = false;
    cancelAnimationFrame(animationId);
  }
});

speedBar.addEventListener("input", function () {
  speedValue.textContent = this.value;
});

/***** HIDE CURSOR FEATURE *****/
const cursorToggle = document.getElementById("cursorToggle");
cursorToggle.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("hide-cursor");
  } else {
    document.body.classList.remove("hide-cursor");
  }
});

/***** COLLAPSE UI FEATURE *****/
const toggleBtn = document.getElementById("collapseToggle");
const collapseIcon = document.getElementById("collapseIcon");
const uiContainer = document.getElementById("mainContainer");

toggleBtn.addEventListener("click", () => {
  uiContainer.classList.toggle("collapsed");

  const isCollapsed = uiContainer.classList.contains("collapsed");
  collapseIcon.src = isCollapsed
    ? "../../images/ui_plus.svg"
    : "../../images/ui_minus.svg";
});

/***** AUTO-START SIMULATION ON PAGE LOAD *****/
document.addEventListener("DOMContentLoaded", () => {
  // If animation toggle is checked (it is by default), start simulation.
  if (animationToggle.checked) {
    isPlaying = true;
    simulationStartTime = null;
    requestAnimationFrame(simulateMouseMotion);
  }
});
