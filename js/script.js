// Header Menu Animation (unchanged) script.js](file-service://file-Q5k72ksX7EpFQPNUJXeRa6)
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
  header.style.visibility = "visible";
  adjustMenuWidth();

  headerButton.addEventListener("click", () => {
    isOpen = !isOpen;
    header.classList.toggle("open", isOpen);
    adjustMenuWidth();
  });
})();

// --------------------------------------------------------------------
// Tool Gallery Sorting by data-date (newest first) and fallback to name
// --------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  // Try case study layout first
  let container = document.querySelector(".case-gallery");
  let selector = ".case-block";

  // If not found, fallback to index layout
  if (!container) {
    container = document.querySelector(".tooltool-gallery");
    selector = ".tooltool-item";
  }

  if (!container) return;

  const items = Array.from(container.querySelectorAll(`:scope > ${selector}`));

  items.sort((a, b) => {
    const dateA = new Date(a.dataset.date);
    const dateB = new Date(b.dataset.date);

    if (!isNaN(dateA) && !isNaN(dateB)) {
      return dateB - dateA; // newest first
    }

    return (a.dataset.name || "").localeCompare(b.dataset.name || "");
  });

  // Reorder in DOM
  items.forEach((item) => container.appendChild(item));
});

// --------------------------------------------------------------------
// Autoplay videos on page show
// --------------------------------------------------------------------
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    // Reload to fix frozen layout when navigating back
    window.location.reload();
  }
});

// --------------------------------------------------------------------
// handle
// --------------------------------------------------------------------
function initScrollHandles() {
  document.querySelectorAll(".case-block").forEach((block) => {
    const slider = block.querySelector(".scroll-handle");
    const carousel = block.querySelector(".carousel");
    const track = block.querySelector(".carousel-track");
    if (!slider || !carousel || !track) return;

    const duration = 30000;
    let startTime = null,
      rafId,
      paused = false;

    const maxScroll = () => track.scrollWidth - carousel.clientWidth;

    // slider → scroll
    slider.min = 0;
    slider.max = 100;
    slider.step = 0.1;
    slider.oninput = () => {
      carousel.scrollLeft = (slider.value / 100) * maxScroll();
    };

    // scroll → slider
    carousel.onscroll = () => {
      slider.value =
        maxScroll() > 0 ? (carousel.scrollLeft / maxScroll()) * 100 : 0;
    };

    // pause on drag
    slider.addEventListener("pointerdown", () => {
      paused = true;
      cancelAnimationFrame(rafId);
    });
    slider.addEventListener("pointerup", () => {
      const pct = slider.value / 100;
      startTime = performance.now() - pct * duration;
      paused = false;
      rafId = requestAnimationFrame(animate);
    });

    function animate(ts) {
      if (paused) return;
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ms = maxScroll();
      slider.value = progress * 100;
      carousel.scrollLeft = progress * ms;
      if (progress < 1) rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    window.addEventListener("resize", () => {
      /* maxScroll adapts automatically */
    });
  });
}

// kick off as soon as DOM is ready
document.addEventListener("DOMContentLoaded", initScrollHandles);
window.addEventListener("pageshow", (e) => {
  if (e.persisted) initScrollHandles();
});

// --------------------------------------------------------------------
// Autoplay videos when in view
// --------------------------------------------------------------------
const videos = document.querySelectorAll("video");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.play();
    } else {
      entry.target.pause();
    }
  });
});

videos.forEach((video) => observer.observe(video));
