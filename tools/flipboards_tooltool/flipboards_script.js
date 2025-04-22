/* ============================================
   Header Menu Animation
   - Adjusts the header width and toggles the open state.
   ============================================ */
(() => {
  const header = document.querySelector(".header");
  const inside = header.querySelector(".inside");
  const headerLogo = header.querySelector(".header-logo");
  const headerButton = header.querySelector(".header-button");
  let isOpen = false;

  function adjustMenuWidth() {
    const logoW = headerLogo.offsetWidth;
    const btnW = headerButton.offsetWidth;
    const insideW = inside.scrollWidth;
    header.style.width = isOpen
      ? `${logoW + insideW + btnW}px`
      : `${logoW + btnW}px`;
  }

  // Wait for font to load before measuring
  document.fonts.ready.then(() => {
    adjustMenuWidth();
    header.style.visibility = "visible";
  });

  headerButton.addEventListener("click", () => {
    isOpen = !isOpen;
    header.classList.toggle("open", isOpen);
    adjustMenuWidth();
  });
})();

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

/* ---------- Variable Declarations ---------- */
const displayContainer = document.getElementById("display");
const textInput = document.getElementById("textInput");
const playButton = document.getElementById("playButton");

const animationDuration = 600;
const sequentialDelay = 100;
const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ?!.-#";

/* ---------- Helper Functions ---------- */
// Create a new character slot element
function createSlotElement(character = " ") {
  const slot = document.createElement("div");
  slot.classList.add("char-slot");
  slot.dataset.currentChar = character;

  const topFlap = document.createElement("div");
  topFlap.classList.add("flap", "top");
  const topText = document.createElement("span");
  topText.textContent = character;
  topFlap.appendChild(topText);

  const bottomFlap = document.createElement("div");
  bottomFlap.classList.add("flap", "bottom");
  const bottomText = document.createElement("span");
  bottomText.textContent = character;
  bottomFlap.appendChild(bottomText);

  slot.appendChild(topFlap);
  slot.appendChild(bottomFlap);
  return slot;
}

/* ---------- Main Animation Function ---------- */
function runDisplayAnimation() {
  const inputText = textInput.value.toUpperCase();
  // Split input into lines (on newline). Each line will be rendered separately.
  const lines = inputText.split("\n");
  displayContainer.innerHTML = "";
  let globalIndex = 0;
  lines.forEach((line) => {
    // Create a container for this line
    const lineContainer = document.createElement("div");
    lineContainer.classList.add("line");
    // For each character in the line
    for (let i = 0; i < line.length; i++) {
      const char = line.charAt(i);
      // Create a slot with a blank initial value
      const slot = createSlotElement(" ");
      lineContainer.appendChild(slot);
      // Animate to the target character (if valid, else blank)
      setTimeout(() => {
        animateFlip(slot, validChars.includes(char) ? char : " ");
      }, globalIndex * sequentialDelay);
      globalIndex++;
    }
    displayContainer.appendChild(lineContainer);
  });
}

/* ---------- Animate a Single Slot ---------- */
function animateFlip(slot, newChar) {
  const topFlap = slot.querySelector(".flap.top");
  const bottomFlap = slot.querySelector(".flap.bottom");
  const topText = topFlap.querySelector("span");
  const bottomText = bottomFlap.querySelector("span");
  const currentChar = slot.dataset.currentChar || " ";
  // Set texts to current char before flip
  topText.textContent = currentChar;
  bottomText.textContent = currentChar;
  // Pre-set bottom flap's text to new character
  bottomText.textContent = newChar;
  slot.classList.add("flipping");
  // Update top flap mid-animation
  setTimeout(() => {
    topText.textContent = newChar;
  }, animationDuration / 2);
  // Cleanup after animation
  setTimeout(() => {
    slot.classList.remove("flipping");
    topText.textContent = newChar;
    bottomText.textContent = newChar;
    slot.dataset.currentChar = newChar;
  }, animationDuration + 50);
}

// Helper function to update a CSS variable
function updateCssVariable(variableName, value) {
  document.documentElement.style.setProperty(variableName, value);
}

/* ---------- Event Listeners ---------- */
// Play button listener
playButton.addEventListener("click", runDisplayAnimation);
textInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    event.preventDefault();
    runDisplayAnimation();
  }
});
// Background Preset Listeners (for window background)
const presetBgEls = document.querySelectorAll(".preset-bg");
presetBgEls.forEach((el) => {
  el.addEventListener("click", (e) => {
    const newColor = e.currentTarget.dataset.color;
    updateCssVariable("--color-background", newColor);
  });
});
// Custom Background Color Picker
const bgColorInput = document.getElementById("bgColorInput");
bgColorInput.addEventListener("input", (e) => {
  const newColor = e.target.value;
  updateCssVariable("--color-background", newColor);
});

// Letter Color Preset Listeners
const presetLetterEls = document.querySelectorAll(".preset-letter");
presetLetterEls.forEach((el) => {
  el.addEventListener("click", (e) => {
    const newColor = e.currentTarget.dataset.color;
    updateCssVariable("--text-color", newColor);
  });
});
// Custom Letter Color Picker
const letterColorInput = document.getElementById("letterColorInput");
letterColorInput.addEventListener("input", (e) => {
  const newColor = e.target.value;
  updateCssVariable("--text-color", newColor);
});
window.addEventListener("DOMContentLoaded", runDisplayAnimation);
