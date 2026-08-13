// Check if user is logged in

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "login.html";
}

// Welcome user

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

// Get movies

const allMovies = JSON.parse(localStorage.getItem("movies")) || [];

const movies = allMovies.filter(
  (movie) => movie.ownerEmail === loggedInUser.email,
);
// Total movies

document.getElementById("totalMovies").textContent = movies.length;

// Latest movie

const latestMovie = document.getElementById("latestMovie");

const latestMoviePoster = document.getElementById("latestMoviePoster");

if (movies.length > 0) {
  const latest = movies[movies.length - 1];

  // Display movie title

  latestMovie.textContent = latest.title;

  // Display movie poster

  if (latest.poster) {
    latestMoviePoster.src = latest.poster;
  } else {
    latestMoviePoster.src = "/image/default-movie.webp";
  }
} else {
  latestMovie.textContent = "None";

  latestMoviePoster.src = "/image/default-movie.webp";
}
// Count genres

const genres = [...new Set(movies.map((movie) => movie.genre))];

document.getElementById("totalGenres").textContent = genres.length;

// Favorites

const favorites = movies.filter((movie) => movie.favorite === true);

document.getElementById("favoriteMovies").textContent = favorites.length;

// ========================================
// LOGOUT MODAL
// ========================================

const logoutBtn = document.getElementById("logoutBtn");

const logoutModal = document.getElementById("logoutModal");

const cancelLogout = document.getElementById("cancelLogout");

const confirmLogout = document.getElementById("confirmLogout");

// Open modal

logoutBtn.addEventListener("click", function () {
  logoutModal.classList.remove("hidden");
});

// Cancel logout

cancelLogout.addEventListener("click", function () {
  logoutModal.classList.add("hidden");
});

// Confirm logout

confirmLogout.addEventListener("click", function () {
  localStorage.removeItem("loggedInUser");

  window.location.href = "login.html";
});
