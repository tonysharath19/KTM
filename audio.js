// ==========================================================
// Shared Click Audio
// ==========================================================
const clickSound = new Audio("Media/audio/S.mp3");
clickSound.preload = "auto";

// ----------------------------------------------------------
// Play and Navigate (for links that load new pages)
// ----------------------------------------------------------
function playAndNavigate(e) {
  e.preventDefault(); // stop default navigation
  const targetUrl = e.currentTarget.href;

  // restart and play sound
  clickSound.currentTime = 0;
  clickSound.play();

  // delay navigation so audio plays
  setTimeout(() => {
    window.location.href = targetUrl;
  }, 700); // adjust 500–1000ms as you like
}

// ----------------------------------------------------------
// Play only (for buttons that don’t reload page)
// ----------------------------------------------------------
function playOnly() {
  clickSound.currentTime = 0;
  clickSound.play();
}

// ----------------------------------------------------------
// Attach events after DOM ready
// ----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // All nav links (side menu + header + footer if needed)
  document.querySelectorAll("#sideMenu a, header a, footer a").forEach(link => {
    link.addEventListener("click", playAndNavigate);
  });

  // All buttons (hamburger, form buttons, etc.)
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", playOnly);
  });
});
