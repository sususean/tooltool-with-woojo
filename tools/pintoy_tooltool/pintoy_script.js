/* ============================================
   Header Menu Animation
   - Adjusts the header width and toggles the open state.
   ============================================ */
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

/* ============================================
     Canvas and UI Elements Initialization
     - Gets canvas, its context, container, inputs for text, color, speed, and animation toggle.
     ============================================ */
const canvas = document.getElementById("dotCanvas");
const ctx = canvas.getContext("2d");
const canvasContainer = document.getElementById("canvas-container");

const textInput = document.getElementById("textInput");

const textDotColorInput = document.getElementById("textDotColor");
const gridDotColorInput = document.getElementById("gridDotColor");
const extrusionColorInput = document.getElementById("extrusionColor");
const bgColorInput = document.getElementById("bgColor");

const speedBar = document.querySelector(".speed-bar");
const speedValue = document.getElementById("speedValue");
let animationSpeed = Number(speedBar.value);

const animationToggle = document.querySelector(".switch input");
let animationOn = animationToggle.checked;

/* ============================================
     Font Data Definitions
     - Defines a 5x7 pixel font for letters, numbers, and some symbols.
     ============================================ */
const FONT_DATA = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11100, 0b10010, 0b10001, 0b10001, 0b10001, 0b10010, 0b11100],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01110],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  J: [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10001, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01111],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  0: [0b01110, 0b10011, 0b10101, 0b10101, 0b11001, 0b10001, 0b01110],
  1: [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  2: [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111],
  3: [0b01110, 0b10001, 0b00001, 0b00110, 0b00001, 0b10001, 0b01110],
  4: [0b00110, 0b01010, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  5: [0b11111, 0b10000, 0b10000, 0b11110, 0b00001, 0b10001, 0b01110],
  6: [0b01110, 0b10000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  7: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  8: [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  9: [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00001, 0b01110],
  ".": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b01100, 0b01100],
  "!": [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00000, 0b00100],
  "?": [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b00000, 0b00100],
  "-": [0b00000, 0b00000, 0b00000, 0b11111, 0b00000, 0b00000, 0b00000],
  " ": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
};

const FONT_WIDTH = 5;
const FONT_HEIGHT = 7;

/* ============================================
     Dot Layout and Spacing Settings
     - Sets dot size, gap, spacing between characters/lines, and grid step.
     ============================================ */
let dotSize = 12;
let gap = 8;
let characterSpacing = 1; // Extra columns between letters
let step = dotSize + gap; // Distance between dot centers
let lineSpacing = 1; // Extra rows between lines

/* ============================================
     Pop Effect and Flow Animation Settings
     - Configures the pop offset for extrusion and the animation amplitude.
     ============================================ */
let basePopOffset = dotSize * 0.3;
let popDistanceScale = 0.06;
let maxTotalPopOffset = dotSize * 5.0;
const flowAmplitude = 0.3; // 30% extrusion variation

/* ============================================
     Mouse Position Tracking
     - Stores the current mouse position.
     ============================================ */
let mouseX = 0,
  mouseY = 0;

/* ============================================
     Fixed Layout Variables and Initialization
     - Variables for the fixed grid settings and initial layout.
     ============================================ */
let initialCanvasWidth, initialCanvasHeight;
let fixedCols, fixedRows;
let initialGridStartX, initialGridStartY;
let textRelativePositions = []; // Holds text dot positions relative to grid origin

function initFixedLayout() {
  initialCanvasWidth = canvasContainer.clientWidth;
  initialCanvasHeight = canvasContainer.clientHeight;
  step = dotSize + gap;
  fixedCols = Math.floor(initialCanvasWidth / step + 4);
  fixedRows = Math.floor(initialCanvasHeight / step + 4);
  initialGridStartX = (initialCanvasWidth - fixedCols * step) / 4;
  initialGridStartY = (initialCanvasHeight - fixedRows * step) / 4;
  updateTextRelativePositions();
}

/* ============================================
     Update Text Relative Positions
     - Computes dot positions for each character in the text input.
     ============================================ */
function updateTextRelativePositions() {
  const lines = (textInput.value || "POP").toUpperCase().split("\n");
  textRelativePositions = [];
  let maxRx = 0;
  const numLines = lines.length;
  const totalTextRows = numLines * FONT_HEIGHT + (numLines - 1) * lineSpacing;
  const textStartRow = Math.floor((fixedRows - totalTextRows) / 2);

  for (let i = 0; i < numLines; i++) {
    const line = lines[i];
    const lettersCount = line.length;
    const lineWidthCols =
      lettersCount * (FONT_WIDTH + characterSpacing) -
      (lettersCount > 0 ? characterSpacing : 0);
    const textStartCol = Math.floor((fixedCols - lineWidthCols) / 2);
    let currentLetterCol = textStartCol;
    for (let j = 0; j < lettersCount; j++) {
      const char = line[j];
      const pattern = FONT_DATA[char] || FONT_DATA[" "];
      for (let row = 0; row < FONT_HEIGHT; row++) {
        for (let col = 0; col < FONT_WIDTH; col++) {
          if (((pattern[row] >> (FONT_WIDTH - 1 - col)) & 1) === 1) {
            const rx = (currentLetterCol + col) * step;
            const ry =
              (textStartRow + i * (FONT_HEIGHT + lineSpacing) + row) * step;
            if (rx > maxRx) maxRx = rx;
            textRelativePositions.push({ rx, ry });
          }
        }
      }
      currentLetterCol += FONT_WIDTH + characterSpacing;
    }
  }
  // Assign each dot a phase for the flow animation based on its horizontal position.
  for (let pos of textRelativePositions) {
    pos.amplitude = flowAmplitude;
    pos.phase = maxRx > 0 ? (pos.rx / maxRx) * 2 * Math.PI : 0;
  }
}

/* ============================================
     Canvas Resize and Recalculation
     - Resizes the canvas, adjusts for device pixel ratio, and reinitializes layout variables.
     ============================================ */
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvasContainer.clientWidth * dpr;
  canvas.height = canvasContainer.clientHeight * dpr;
  canvas.style.width = canvasContainer.clientWidth + "px";
  canvas.style.height = canvasContainer.clientHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  step = dotSize + gap;
  if (!initialCanvasWidth || !initialCanvasHeight) {
    initFixedLayout();
    mouseX = canvasContainer.clientWidth / 2;
    mouseY = canvasContainer.clientHeight / 2;
  }
  draw();
}

/* ============================================
     Main Draw Function
     - Renders the background grid, calculates extrusion based on mouse position,
       and draws the text dots along with their animated extrusion lines.
     ============================================ */
function draw() {
  const viewWidth = canvasContainer.clientWidth;
  const viewHeight = canvasContainer.clientHeight;
  const gridStartX = (viewWidth - fixedCols * step) / 2;
  const gridStartY = (viewHeight - fixedRows * step) / 2;

  // Clear canvas with background color.
  ctx.fillStyle = bgColorInput.value;
  ctx.fillRect(0, 0, viewWidth, viewHeight);
  canvasContainer.style.backgroundColor = bgColorInput.value;

  // Draw background grid dots.
  ctx.fillStyle = gridDotColorInput.value;
  for (let r = 0; r < fixedRows; r++) {
    for (let c = 0; c < fixedCols; c++) {
      const gx = gridStartX + c * step;
      const gy = gridStartY + r * step;
      ctx.beginPath();
      ctx.arc(gx, gy, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Calculate extrusion offset based on mouse position.
  const centerX = viewWidth / 2;
  const centerY = viewHeight / 2;
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  let offsetX = 0,
    offsetY = 0;
  let currentOffset = basePopOffset;
  if (dist > 1) {
    const angle = Math.atan2(dy, dx);
    currentOffset = Math.min(
      maxTotalPopOffset,
      basePopOffset + dist * popDistanceScale
    );
    offsetX = Math.cos(angle) * currentOffset;
    offsetY = Math.sin(angle) * currentOffset;
  } else {
    const defaultAngle = Math.PI / 4;
    offsetX = Math.cos(defaultAngle) * currentOffset;
    offsetY = Math.sin(defaultAngle) * currentOffset;
  }

  // Use performance time for the flow animation.
  const t = performance.now() / 1000;

  // Draw extrusion lines for text dots.
  ctx.strokeStyle = extrusionColorInput.value;
  ctx.lineWidth = dotSize;
  ctx.lineCap = "round";
  for (const pos of textRelativePositions) {
    const baseX = gridStartX + pos.rx;
    const baseY = gridStartY + pos.ry;
    const multiplier = animationOn
      ? 1 + pos.amplitude * Math.sin(animationSpeed * t + pos.phase)
      : 1;
    const finalX = baseX + offsetX * multiplier;
    const finalY = baseY + offsetY * multiplier;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(finalX, finalY);
    ctx.stroke();
  }

  // Draw text dots.
  ctx.fillStyle = textDotColorInput.value;
  for (const pos of textRelativePositions) {
    const baseX = gridStartX + pos.rx;
    const baseY = gridStartY + pos.ry;
    const multiplier = animationOn
      ? 1 + pos.amplitude * Math.sin(animationSpeed * t + pos.phase)
      : 1;
    const finalX = baseX + offsetX * multiplier;
    const finalY = baseY + offsetY * multiplier;
    ctx.beginPath();
    ctx.arc(finalX, finalY, dotSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ============================================
     Animation Loop
     - Continuously updates the canvas drawing if animation is enabled.
     ============================================ */
function animate() {
  if (animationOn) {
    requestAnimationFrame(animate);
  }
  draw();
}

/* ============================================
     Event Listeners for Interaction
     - Updates mouse position, text input changes, color changes, speed adjustments, and toggle changes.
     ============================================ */
// Mouse movement over canvas container.
canvasContainer.addEventListener("mousemove", (e) => {
  const rect = canvasContainer.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  draw();
});
canvasContainer.addEventListener("mouseleave", () => {
  draw();
});

// Window resize event.
window.addEventListener("resize", resizeCanvas);

// Text input change for updating text fill.
textInput.addEventListener("input", () => {
  updateTextRelativePositions();
  draw();
});

// Color input changes.
textDotColorInput.addEventListener("input", draw);
gridDotColorInput.addEventListener("input", draw);
extrusionColorInput.addEventListener("input", draw);
bgColorInput.addEventListener("input", draw);

// Speed control input changes.
speedBar.addEventListener("input", () => {
  animationSpeed = Number(speedBar.value);
  speedValue.textContent = animationSpeed;
  draw();
});

// Toggle animation on/off.
animationToggle.addEventListener("change", () => {
  animationOn = animationToggle.checked;
  if (animationOn) {
    animate();
  } else {
    draw();
  }
});

/* ============================================
     Initial Setup and Start Animation
     - Resizes the canvas and starts the animation loop.
     ============================================ */
resizeCanvas();
animate();

/***** BACKGROUND COLOR FEATURE *****/
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
