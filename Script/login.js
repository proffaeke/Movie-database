// Initialize Lucide icons
if (window.lucide) {
  lucide.createIcons();
}

// Login elements
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");

// Login form
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value;

  loginMessage.className = "text-sm";

  if (email === "" || password === "") {
    loginMessage.textContent = "Please fill in all fields.";
    loginMessage.classList.add("text-red-400");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(function (user) {
    return user.email.toLowerCase() === email && user.password === password;
  });

  if (!foundUser) {
    loginMessage.textContent = "Invalid email or password.";
    loginMessage.classList.add("text-red-400");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

  loginMessage.textContent =
    "Login successful! Redirecting to the dashboard...";
  loginMessage.classList.add("text-green-400");

  setTimeout(function () {
    window.location.href = "dashboard.html";
  }, 1500);
});

// Forgot password elements
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

let resetUser = null;

// Open password reset modal
forgotPasswordBtn.addEventListener("click", function () {
  forgotPasswordModal.classList.remove("hidden");
  forgotPasswordModal.classList.add("flex");
});

// Close modal and reset its steps
function closeForgotPasswordModal() {
  forgotPasswordModal.classList.add("hidden");
  forgotPasswordModal.classList.remove("flex");

  forgotEmailStep.classList.remove("hidden");
  forgotNewPasswordStep.classList.add("hidden");

  forgotEmail.value = "";
  forgotNewPassword.value = "";
  forgotConfirmPassword.value = "";

  forgotEmailMessage.textContent = "";
  resetPasswordMessage.textContent = "";

  resetUser = null;
}

cancelForgotPassword.addEventListener("click", closeForgotPasswordModal);

cancelResetPassword.addEventListener("click", closeForgotPasswordModal);

// Find account
findAccountBtn.addEventListener("click", function () {
  const email = forgotEmail.value.trim().toLowerCase();

  forgotEmailMessage.className = "mt-3 text-sm";

  if (email === "") {
    forgotEmailMessage.textContent = "Please enter your email.";
    forgotEmailMessage.classList.add("text-red-400");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(function (user) {
    return user.email.toLowerCase() === email;
  });

  if (!user) {
    forgotEmailMessage.textContent = "No account was found with this email.";
    forgotEmailMessage.classList.add("text-red-400");
    return;
  }

  resetUser = user;

  forgotEmailStep.classList.add("hidden");
  forgotNewPasswordStep.classList.remove("hidden");
});

// Reset password
resetPasswordBtn.addEventListener("click", function () {
  const newPassword = forgotNewPassword.value;
  const confirmPassword = forgotConfirmPassword.value;

  resetPasswordMessage.className = "mt-3 text-sm";

  if (!newPassword || !confirmPassword) {
    resetPasswordMessage.textContent = "Please fill in both password fields.";
    resetPasswordMessage.classList.add("text-red-400");
    return;
  }

  if (newPassword.length < 8) {
    resetPasswordMessage.textContent =
      "Password must be at least 8 characters.";
    resetPasswordMessage.classList.add("text-red-400");
    return;
  }

  if (newPassword !== confirmPassword) {
    resetPasswordMessage.textContent = "Passwords do not match.";
    resetPasswordMessage.classList.add("text-red-400");
    return;
  }

  if (!resetUser) {
    resetPasswordMessage.textContent = "Please find your account again.";
    resetPasswordMessage.classList.add("text-red-400");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userIndex = users.findIndex(function (user) {
    return user.email.toLowerCase() === resetUser.email.toLowerCase();
  });

  if (userIndex === -1) {
    resetPasswordMessage.textContent =
      "Something went wrong. Please try again.";
    resetPasswordMessage.classList.add("text-red-400");
    return;
  }

  users[userIndex].password = newPassword;

  localStorage.setItem("users", JSON.stringify(users));

  resetPasswordMessage.textContent = "Password reset successfully!";
  resetPasswordMessage.classList.add("text-green-400");

  setTimeout(function () {
    closeForgotPasswordModal();
  }, 1500);
});
