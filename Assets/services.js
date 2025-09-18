document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const sideMenu = document.getElementById('sideMenu');
  const closeBtn = document.querySelector('.close-btn');

  hamburger.addEventListener('click', function() {
    sideMenu.style.width = '250px';
  });

  closeBtn.addEventListener('click', function() {
    sideMenu.style.width = '0';
  });

  // Reveal on scroll
  function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const revealPoint = 150;

      if (elementTop < windowHeight - revealPoint) {
        reveals[i].classList.add('reveal-active');
      } else {
        reveals[i].classList.remove('reveal-active');
      }
    }
  }

  window.addEventListener('scroll', reveal);
  reveal();
});
