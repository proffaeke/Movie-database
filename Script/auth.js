// Initialize Lucide icons
if (window.lucide) {
  lucide.createIcons();
}

// Get sign-up form elements
const signupForm = document.getElementById("signupForm");

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const message = document.getElementById("message");

// Display form messages consistently
function showMessage(text, type) {
  message.textContent = text;

  message.classList.remove(
    "text-red-500",
    "text-green-600",
    "text-red-400",
    "text-green-400",
  );

  if (type === "success") {
    message.classList.add("text-green-400");
  } else {
    message.classList.add("text-red-400");
  }
}

// Handle account registration
signupForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newUsername = username.value.trim();
  const newEmail = email.value.trim().toLowerCase();
  const newPassword = password.value;
  const newConfirmPassword = confirmPassword.value;

  // Check required fields
  if (
    newUsername === "" ||
    newEmail === "" ||
    newPassword === "" ||
    newConfirmPassword === ""
  ) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  // Check password confirmation
  if (newPassword !== newConfirmPassword) {
    showMessage("Passwords do not match.", "error");
    return;
  }

  // Check password length
  if (newPassword.length < 8) {
    showMessage("Password must be at least 8 characters.", "error");
    return;
  }

  // Get existing users
  let users = [];

  try {
    users = JSON.parse(localStorage.getItem("users")) || [];

    if (!Array.isArray(users)) {
      users = [];
    }
  } catch (error) {
    showMessage("Unable to read saved accounts. Please try again.", "error");
    return;
  }

  // Check for an existing email
  const emailExists = users.some(function (user) {
    return user.email?.toLowerCase() === newEmail;
  });

  if (emailExists) {
    showMessage("An account with this email already exists.", "error");
    return;
  }

  // Create the new account
  const user = {
    username: newUsername,
    email: newEmail,
    password: newPassword,
  };

  users.push(user);

  try {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  } catch (error) {
    showMessage("Unable to save your account. Please try again.", "error");
    return;
  }

  // Show success message
  showMessage("Account created successfully!", "success");

  signupForm.reset();

  // Redirect to the login page
  setTimeout(function () {
    window.location.href = "login.html";
  }, 1500);
});
