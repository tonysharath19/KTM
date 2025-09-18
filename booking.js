// Menu open/close functions
function openMenu() {
    document.getElementById("sideMenu").style.width = "250px";
  }
  function closeMenu() {
    document.getElementById("sideMenu").style.width = "0";
  }
  
  // Hours increment/decrement
  function changeHours(step) {
    const hoursInput = document.getElementById("hours");
    let value = parseInt(hoursInput.value) || 1;
    value += step;
    if (value < 1) value = 1;
    hoursInput.value = value;
  }
  
  // Form validation
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookingForm");
  
    form.addEventListener("submit", function (e) {
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const hours = document.getElementById("hours").value;
  
      // Basic validations
      if (!name || !phone || !email || !hours) {
        alert("Please fill all required fields.");
        e.preventDefault();
        return;
      }
  
      if (!/^[0-9]{10,15}$/.test(phone)) {
        alert("Phone number must be between 10 and 15 digits.");
        e.preventDefault();
        return;
      }
  
      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        e.preventDefault();
        return;
      }
    });
  });
  