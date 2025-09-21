// =========================================================
// Scratch Card Effect Script
// =========================================================
document.addEventListener('DOMContentLoaded', function () {
  const scratchCards = document.querySelectorAll('.scratch-card');

  // ---------------------------------------------------------
  // Initialize Canvas Overlay
  // ---------------------------------------------------------
  function initCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Silver-gray gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#dcdcdc");
    gradient.addColorStop(1, "#a9a9a9");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // "Scratch Me" text
    ctx.fillStyle = "black";
    ctx.font = "bold " + Math.min(canvas.width / 10, 28) + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch Me", canvas.width / 2, canvas.height / 2);
  }

  // ---------------------------------------------------------
  // Apply scratch logic to each card
  // ---------------------------------------------------------
  scratchCards.forEach(card => {
    const canvas = card.querySelector('.scratch-canvas');
    const ctx = canvas.getContext('2d');

    initCanvas(canvas);

    let isDrawing = false;
    let lastPos = null;

    // -------------------------------
    // Helpers
    // -------------------------------
    function getPointerPos(e) {
      const rect = canvas.getBoundingClientRect();
      if (e.touches) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    }

    // -------------------------------
    // Drawing Functions
    // -------------------------------
    function startDrawing(e) {
      isDrawing = true;
      draw(e);
    }

    function stopDrawing() {
      isDrawing = false;
      lastPos = null;
      ctx.beginPath();
      checkScratchPercentage();
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPointerPos(e);

      ctx.globalCompositeOperation = 'destination-out';

      // Smooth line between positions
      if (lastPos) {
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.lineWidth = 40;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Circle erase
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, Math.max(canvas.width / 20, 15), 0, Math.PI * 2);
      ctx.fill();

      lastPos = pos;
    }

    // -------------------------------
    // Check Scratch Percentage
    // -------------------------------
    function checkScratchPercentage() {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let pixels = imageData.data;
      let transparent = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
      }

      let percent = (transparent / (canvas.width * canvas.height)) * 100;

      if (percent > 60) {
        // Fade out animation instead of instant clear
        canvas.classList.add("fade-out");
        setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.classList.remove("fade-out");
        }, 600);
      }
    }

    // -------------------------------
    // Event Listeners
    // -------------------------------
    // Mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
  });

  // ---------------------------------------------------------
  // Reinitialize all overlays on resize
  // ---------------------------------------------------------
  window.addEventListener('resize', () => {
    scratchCards.forEach(card => {
      const canvas = card.querySelector('.scratch-canvas');
      initCanvas(canvas);
    });
  });
});

// =========================================================
// Side Menu Functions
// =========================================================
function openMenu() {
  document.getElementById("sideMenu").style.width = "250px";
}
function closeMenu() {
  document.getElementById("sideMenu").style.width = "0";
}
