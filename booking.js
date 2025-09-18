// Menu open/close
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
  updatePrice();
}

// Update total price
function updatePrice() {
  const hours = parseInt(document.getElementById("hours").value) || 1;
  const price = hours * 1000;
  document.getElementById("totalPrice").textContent = price;
}

// Form validation
document.addEventListener("DOMContentLoaded", () => {
  updatePrice(); // Initialize price on load

  // Update price when hours input changes
  document.getElementById("hours").addEventListener("input", updatePrice);

  const form = document.getElementById("bookingForm");

  form.addEventListener("submit", function (e) {
    // Collect form values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const hours = document.getElementById("hours").value;

    // Basic validation
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

    if (!email.includes('@') || !email.endsWith('.com')) {
      alert("Email must contain '@' and end with '.com'.");
      e.preventDefault();
      return;
    }

    // If validation passes, form will submit to Formspree
  });
});
