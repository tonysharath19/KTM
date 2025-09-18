document.addEventListener('DOMContentLoaded', function () {
  const scratchCards = document.querySelectorAll('.scratch-card');

  scratchCards.forEach(card => {
    const canvas = card.querySelector('.scratch-canvas');
    const ctx = canvas.getContext('2d');
    const img = card.querySelector('.hidden-image');

    function initCanvas() {
      canvas.width = img.width;
      canvas.height = img.height;

      // Silver-gray overlay
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#dcdcdc");
      gradient.addColorStop(1, "#a9a9a9");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw "Scratch Me" text
      ctx.fillStyle = "black";
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Scratch Me", canvas.width / 2, canvas.height / 2);
    }

    if (img.complete) {
      initCanvas();
    } else {
      img.onload = initCanvas;
    }

    let isDrawing = false;

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

    function startDrawing(e) {
      isDrawing = true;
      draw(e);
    }

    function stopDrawing() {
      isDrawing = false;
      ctx.beginPath();
      checkScratchPercentage();
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPointerPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkScratchPercentage() {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let pixels = imageData.data;
      let transparent = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
      }

      let percent = (transparent / (canvas.width * canvas.height)) * 100;

      if (percent > 60) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);

    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchend', stopDrawing);

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);
  });
});

// Menu open/close functions
function openMenu() {
  document.getElementById("sideMenu").style.width = "250px";
}
function closeMenu() {
  document.getElementById("sideMenu").style.width = "0";
}
