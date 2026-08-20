const signupForm = document.getElementById("signupForm");

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const message = document.getElementById("message");

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newUsername = username.value.trim();
  const newEmail = email.value.trim().toLowerCase();
  const newPassword = password.value;
  const newConfirmPassword = confirmPassword.value;

  if (
    newUsername === "" ||
    newEmail === "" ||
    newPassword === "" ||
    newConfirmPassword === ""
  ) {
    message.textContent = "Please fill in all fields.";

    message.classList.remove("text-green-600");
    message.classList.add("text-red-500");

    return;
  }

  if (newPassword !== newConfirmPassword) {
    message.textContent = "Passwords do not match.";

    message.classList.remove("text-green-600");
    message.classList.add("text-red-500");

    return;
  }

  if (newPassword.length < 8) {
    message.textContent = "Password must be at least 8 characters.";

    message.classList.remove("text-green-600");
    message.classList.add("text-red-500");

    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const emailExist = users.some(function (user) {
    return user.email.toLowerCase() === newEmail;
  });

  if (emailExist) {
    message.textContent = "An account with this email already exists.";

    message.classList.remove("text-green-600");
    message.classList.add("text-red-500");

    return;
  }

  const user = {
    username: newUsername,
    email: newEmail,
    password: newPassword,
  };

  users.push(user);

  localStorage.setItem("users", JSON.stringify(users));

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  message.textContent = "Account created successfully!";

  message.classList.remove("text-red-500");
  message.classList.add("text-green-600");

  signupForm.reset();

  setTimeout(function () {
    window.location.href = "login.html";
  }, 1500);
});
