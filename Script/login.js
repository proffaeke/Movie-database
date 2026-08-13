const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value;

  if (email === "" || password === "") {
    loginMessage.textContent = "Please fill in all fields.";
    return;
  }
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });

  if (!foundUser) {
    loginMessage.textContent = "Invalid email or password.";
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

  loginMessage.classList.remove("text-red-500");
  loginMessage.classList.add("text-green-600");
  loginMessage.textContent =
    "Login successful! Redirecting to the dashboard...";

  setTimeout(function () {
    window.location.href = "dashboard.html";
  }, 2000);
});

// ========================================
// FORGOT PASSWORD
// ========================================

const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

const forgotPasswordModal = document.getElementById("forgotPasswordModal");

const cancelForgotPassword = document.getElementById("cancelForgotPassword");

const forgotEmail = document.getElementById("forgotEmail");

const findAccountBtn = document.getElementById("findAccountBtn");

const forgotEmailMessage = document.getElementById("forgotEmailMessage");

const forgotEmailStep = document.getElementById("forgotEmailStep");

const forgotNewPasswordStep = document.getElementById("forgotNewPasswordStep");

const forgotNewPassword = document.getElementById("forgotNewPassword");

const forgotConfirmPassword = document.getElementById("forgotConfirmPassword");

const resetPasswordBtn = document.getElementById("resetPasswordBtn");

const cancelResetPassword = document.getElementById("cancelResetPassword");

const resetPasswordMessage = document.getElementById("resetPasswordMessage");

// ========================================
// OPEN MODAL
// ========================================

forgotPasswordBtn.addEventListener("click", function () {
  forgotPasswordModal.classList.remove("hidden");
});

// ========================================
// CLOSE MODAL
// ========================================

cancelForgotPassword.addEventListener("click", function () {
  forgotPasswordModal.classList.add("hidden");
});

cancelResetPassword.addEventListener("click", function () {
  forgotPasswordModal.classList.add("hidden");
});

// ========================================
// FIND ACCOUNT
// ========================================

let resetUser = null;

findAccountBtn.addEventListener("click", function () {
  const email = forgotEmail.value.trim();

  if (email === "") {
    forgotEmailMessage.textContent = "Please enter your email.";

    forgotEmailMessage.className = "text-sm mt-3 text-red-500";

    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(function (user) {
    return user.email === email;
  });

  if (!user) {
    forgotEmailMessage.textContent = "No account was found with this email.";

    forgotEmailMessage.className = "text-sm mt-3 text-red-500";

    return;
  }

  // Store the account we're resetting

  resetUser = user;

  // Move to password step

  forgotEmailStep.classList.add("hidden");

  forgotNewPasswordStep.classList.remove("hidden");
});

// ========================================
// RESET PASSWORD
// ========================================

resetPasswordBtn.addEventListener("click", function () {
  const newPassword = forgotNewPassword.value;

  const confirmPassword = forgotConfirmPassword.value;

  if (newPassword === "" || confirmPassword === "") {
    resetPasswordMessage.textContent = "Please fill in both password fields.";

    resetPasswordMessage.className = "text-sm mt-3 text-red-500";

    return;
  }

  if (newPassword.length < 8) {
    resetPasswordMessage.textContent =
      "Password must be at least 8 characters.";

    resetPasswordMessage.className = "text-sm mt-3 text-red-500";

    return;
  }

  if (newPassword !== confirmPassword) {
    resetPasswordMessage.textContent = "Passwords do not match.";

    resetPasswordMessage.className = "text-sm mt-3 text-red-500";

    return;
  }

  // Get all users

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Find the user again

  const userIndex = users.findIndex(function (user) {
    return user.email === resetUser.email;
  });

  if (userIndex === -1) {
    resetPasswordMessage.textContent =
      "Something went wrong. Please try again.";

    resetPasswordMessage.className = "text-sm mt-3 text-red-500";

    return;
  }

  // Update password

  users[userIndex].password = newPassword;

  // Save users

  localStorage.setItem("users", JSON.stringify(users));

  resetPasswordMessage.textContent = "Password reset successfully!";

  resetPasswordMessage.className = "text-sm mt-3 text-green-600";

  // Clear fields

  forgotEmail.value = "";

  forgotNewPassword.value = "";

  forgotConfirmPassword.value = "";

  // Return to login after 1.5 seconds

  setTimeout(function () {
    forgotPasswordModal.classList.add("hidden");

    forgotEmailStep.classList.remove("hidden");

    forgotNewPasswordStep.classList.add("hidden");

    forgotEmailMessage.textContent = "";

    resetPasswordMessage.textContent = "";
  }, 1500);
});
