// ========================================
// CHECK LOGIN
// ========================================

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "login.html";
}

// ========================================
// ELEMENTS
// ========================================

const usernameDisplay = document.getElementById("usernameDisplay");

const userAvatar = document.getElementById("userAvatar");

const profileAvatar = document.getElementById("profileAvatar");

const profileUsername = document.getElementById("profileUsername");

const profileEmail = document.getElementById("profileEmail");

const settingsUsername = document.getElementById("settingsUsername");

const settingsEmail = document.getElementById("settingsEmail");

// ========================================
// DISPLAY USER INFORMATION
// ========================================

function displayUser() {
  const username =
    loggedInUser.username.charAt(0).toUpperCase() +
    loggedInUser.username.slice(1);

  // Navbar

  usernameDisplay.textContent = username;

  userAvatar.textContent = username.charAt(0);

  // Profile

  profileUsername.textContent = username;

  profileEmail.textContent = loggedInUser.email;

  profileAvatar.textContent = username.charAt(0);

  // Inputs

  settingsUsername.value = loggedInUser.username;

  settingsEmail.value = loggedInUser.email;
}

displayUser();

// ========================================
// SAVE PROFILE
// ========================================

const saveProfileBtn = document.getElementById("saveProfileBtn");

const profileMessage = document.getElementById("profileMessage");

saveProfileBtn.addEventListener("click", function () {
  const newUsername = settingsUsername.value.trim();

  if (newUsername === "") {
    profileMessage.textContent = "Username cannot be empty.";

    profileMessage.className = "text-sm mt-4 text-red-500";

    return;
  }

  // Get all users

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Find logged-in user

  const userIndex = users.findIndex(function (user) {
    return user.email === loggedInUser.email;
  });

  if (userIndex === -1) {
    profileMessage.textContent = "User account not found.";

    profileMessage.className = "text-sm mt-4 text-red-500";

    return;
  }

  // Update username

  users[userIndex].username = newUsername;

  // Save users

  localStorage.setItem("users", JSON.stringify(users));

  // Update logged-in user

  loggedInUser.username = newUsername;

  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  // Update display

  displayUser();

  profileMessage.textContent = "Profile updated successfully!";

  profileMessage.className = "text-sm mt-4 text-green-600";
});

// ========================================
// CHANGE PASSWORD
// ========================================

const currentPassword = document.getElementById("currentPassword");

const newPassword = document.getElementById("newPassword");

const confirmNewPassword = document.getElementById("confirmNewPassword");

const changePasswordBtn = document.getElementById("changePasswordBtn");

const passwordMessage = document.getElementById("passwordMessage");

changePasswordBtn.addEventListener("click", function () {
  const current = currentPassword.value;

  const newPass = newPassword.value;

  const confirm = confirmNewPassword.value;

  // Empty fields

  if (current === "" || newPass === "" || confirm === "") {
    passwordMessage.textContent = "Please fill in all password fields.";

    passwordMessage.className = "text-sm mt-4 text-red-500";

    return;
  }

  // Check current password

  if (current !== loggedInUser.password) {
    passwordMessage.textContent = "Current password is incorrect.";

    passwordMessage.className = "text-sm mt-4 text-red-500";

    return;
  }

  // Check new password length

  if (newPass.length < 8) {
    passwordMessage.textContent = "New password must be at least 8 characters.";

    passwordMessage.className = "text-sm mt-4 text-red-500";

    return;
  }

  // Confirm password

  if (newPass !== confirm) {
    passwordMessage.textContent = "New passwords do not match.";

    passwordMessage.className = "text-sm mt-4 text-red-500";

    return;
  }

  // Get users

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userIndex = users.findIndex(function (user) {
    return user.email === loggedInUser.email;
  });

  if (userIndex === -1) {
    passwordMessage.textContent = "User account not found.";

    passwordMessage.className = "text-sm mt-4 text-red-500";

    return;
  }

  // Update password

  users[userIndex].password = newPass;

  localStorage.setItem("users", JSON.stringify(users));

  // Update logged-in user

  loggedInUser.password = newPass;

  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  // Clear fields

  currentPassword.value = "";

  newPassword.value = "";

  confirmNewPassword.value = "";

  passwordMessage.textContent = "Password changed successfully!";

  passwordMessage.className = "text-sm mt-4 text-green-600";
});
// ========================================
// LOGOUT MODAL
// ========================================

const logoutBtn = document.getElementById("logoutBtn");

const settingsLogoutBtn = document.getElementById("settingsLogoutBtn");

const logoutModal = document.getElementById("logoutModal");

const cancelLogout = document.getElementById("cancelLogout");

const confirmLogout = document.getElementById("confirmLogout");

// Sidebar logout button

logoutBtn.addEventListener("click", function () {
  logoutModal.classList.remove("hidden");
});

// Settings logout button

settingsLogoutBtn.addEventListener("click", function () {
  logoutModal.classList.remove("hidden");
});

// Cancel

cancelLogout.addEventListener("click", function () {
  logoutModal.classList.add("hidden");
});

// Confirm logout

confirmLogout.addEventListener("click", function () {
  localStorage.removeItem("loggedInUser");

  window.location.href = "login.html";
});

// ========================================
// MOBILE SIDEBAR
// ========================================

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");

menuBtn.addEventListener("click", function () {
  sidebar.classList.toggle("-translate-x-full");
  sidebarOverlay.classList.toggle("hidden");
});

sidebarOverlay.addEventListener("click", function () {
  sidebar.classList.add("-translate-x-full");
  sidebarOverlay.classList.add("hidden");
});
