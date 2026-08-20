const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "login.html";
}

const welcomeUser = document.getElementById("welcomeUser");

const usernameDisplay = document.getElementById("usernameDisplay");

const userAvatar = document.getElementById("userAvatar");

if (loggedInUser) {
  const username =
    loggedInUser.username.charAt(0).toUpperCase() +
    loggedInUser.username.slice(1);

  welcomeUser.textContent = username;
  usernameDisplay.textContent = username;

  userAvatar.textContent = username.charAt(0);
}

const allMovies = JSON.parse(localStorage.getItem("movies")) || [];

const movies = allMovies.filter(
  (movie) => movie.ownerEmail === loggedInUser.email,
);

document.getElementById("totalMovies").textContent = movies.length;

const latestMovie = document.getElementById("latestMovie");

const latestMoviePoster = document.getElementById("latestMoviePoster");

if (movies.length > 0) {
  const latest = movies[movies.length - 1];

  latestMovie.textContent = latest.title;

  if (latest.poster) {
    latestMoviePoster.src = latest.poster;
  } else {
    latestMoviePoster.src = "/image/default-movie.webp";
  }
} else {
  latestMovie.textContent = "No latest movies yet. Upload your first movie!";

  latestMoviePoster.src = "/image/default-movie.webp";
}

const genres = [...new Set(movies.map((movie) => movie.genre))];

document.getElementById("totalGenres").textContent = genres.length;

const favorites = movies.filter((movie) => movie.favorite === true);

document.getElementById("favoriteMovies").textContent = favorites.length;

const logoutBtn = document.getElementById("logoutBtn");

const logoutModal = document.getElementById("logoutModal");

const cancelLogout = document.getElementById("cancelLogout");

const confirmLogout = document.getElementById("confirmLogout");

logoutBtn.addEventListener("click", function () {
  logoutModal.classList.remove("hidden");
});

cancelLogout.addEventListener("click", function () {
  logoutModal.classList.add("hidden");
});

confirmLogout.addEventListener("click", function () {
  localStorage.removeItem("loggedInUser");

  window.location.href = "login.html";
});

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
