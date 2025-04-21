// Header Menu Animation (unchanged) script.js](file-service://file-Q5k72ksX7EpFQPNUJXeRa6)
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

  setTimeout(() => {
    adjustMenuWidth();
    header.style.visibility = "visible";
  });
});

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
    let startTime = null;
    let rafId = null;
    let paused = false;

    const maxScroll = () => track.scrollWidth - carousel.clientWidth;

    // map slider → scroll
    slider.min = 0;
    slider.max = 100;
    slider.step = 0.1;
    slider.oninput = () => {
      carousel.scrollLeft = (slider.value / 100) * maxScroll();
    };

    // map scroll → slider
    carousel.onscroll = () => {
      slider.value =
        maxScroll() > 0 ? (carousel.scrollLeft / maxScroll()) * 100 : 0;
    };

    // on drag start: pause animation
    slider.addEventListener("pointerdown", () => {
      paused = true;
      cancelAnimationFrame(rafId);
    });
    // on drag end: resume from current spot
    slider.addEventListener("pointerup", () => {
      // compute elapsed time so far
      const pct = slider.value / 100;
      startTime = performance.now() - pct * duration;
      paused = false;
      rafId = requestAnimationFrame(animate);
    });

    // The animation loop
    function animate(timestamp) {
      if (paused) return; // bail out if user is dragging
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ms = maxScroll();

      slider.value = progress * 100;
      carousel.scrollLeft = progress * ms;

      if (progress < 1) rafId = requestAnimationFrame(animate);
    }

    // kick it off
    rafId = requestAnimationFrame(animate);

    // keep handlers in sync on resize
    window.addEventListener("resize", () => {
      // nothing special needed here; maxScroll() is dynamic
    });
  });
}

window.addEventListener("load", initScrollHandles);
window.addEventListener("pageshow", (e) => {
  if (e.persisted) initScrollHandles();
});
