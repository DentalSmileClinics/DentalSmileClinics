document.addEventListener("DOMContentLoaded", () => {

  // 1. Login Form Validation
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();

      if (!username) {
        e.preventDefault();
        alert("Please enter your username.");
        return;
      }

      if (!password) {
        e.preventDefault();
        alert("Please enter your password.");
        return;
      }

      const terms = document.getElementById("login-terms");
      if (terms && !terms.checked) {
        e.preventDefault();
        alert("You must agree to the Terms and Conditions and Privacy Policy before logging in.");
        return;
      }
    });
  }

  // 2. Register Form Validation
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      const name = document.getElementById("reg-name").value.trim();
      const username = document.getElementById("reg-username").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const phone = document.getElementById("reg-phone").value.trim();
      const dob = document.getElementById("reg-dob").value.trim();
      const pwd = document.getElementById("reg-password").value;
      const confirmPwd = document.getElementById("reg-confirm").value;

      if (!name) {
        e.preventDefault();
        alert("Please enter your full name.");
        return;
      }

      if (!username) {
        e.preventDefault();
        alert("Please choose a username.");
        return;
      }

      if (!email || !validateEmail(email)) {
        e.preventDefault();
        alert("Please enter a valid email address.");
        return;
      }
      
      if (!phone) {
        e.preventDefault();
        alert("Please enter your phone number.");
        return;
      }

      if (!dob) {
        e.preventDefault();
        alert("Please select your date of birth.");
        return;
      }

      if (pwd.length < 5) {
        e.preventDefault();
        alert("Password must be at least 5 characters long.");
        return;
      }

      if (pwd !== confirmPwd) {
        e.preventDefault();
        alert("Passwords do not match.");
        return;
      }
    });
  }

  // 3. Simplified Forgot Password Validation
  const forgotForm = document.getElementById("forgot-step1");
  if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
      const username = document.getElementById("forgot-username").value.trim();
      const email = document.getElementById("forgot-email").value.trim();
      
      if (!username) {
        e.preventDefault();
        alert("Please enter your username.");
        return;
      }
      
      if (!email || !validateEmail(email)) {
        e.preventDefault();
        alert("Please enter a valid email address.");
        return;
      }
    });
  }

  // 8. Terms and Policy Modal Handling
  const termsModal = document.getElementById("terms-modal");
  const closeModal = document.getElementById("close-modal");
  const openLinks = document.querySelectorAll(".open-terms");

  if (termsModal && closeModal) {
    openLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        termsModal.classList.remove("hidden");
      });
    });

    closeModal.addEventListener("click", () => {
      termsModal.classList.add("hidden");
    });

    // Close on click outside the content box
    termsModal.addEventListener("click", (e) => {
      if (e.target === termsModal) {
        termsModal.classList.add("hidden");
      }
    });
  }

  // Regex Helper function to validate email format
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // 9. Password Visibility Toggle
  const eyeToggles = document.querySelectorAll(".eye-toggle");
  eyeToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = toggle.parentElement.querySelector("input");
      const eyeIcon = toggle.querySelector(".eye-icon");
      const eyeOffIcon = toggle.querySelector(".eye-off-icon");

      if (input.type === "password") {
        input.type = "text";
        eyeIcon.classList.add("hidden");
        eyeOffIcon.classList.remove("hidden");
      } else {
        input.type = "password";
        eyeIcon.classList.remove("hidden");
        eyeOffIcon.classList.add("hidden");
      }
    });
  });
});
