"use strict";

// ------------------------------
// 1. Check Logged-In User
// ------------------------------
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "login.html";
} else {
  // ------------------------------
  // 2. Initialize Lucide Icons
  // ------------------------------
  if (window.lucide) {
    lucide.createIcons();
  }

  // ------------------------------
  // 3. Display User Information
  // ------------------------------
  const username = loggedInUser.username || "User";
  const formattedUsername =
    username.charAt(0).toUpperCase() + username.slice(1);

  const welcomeUser = document.getElementById("welcomeUser");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const userAvatar = document.getElementById("userAvatar");

  if (welcomeUser) welcomeUser.textContent = formattedUsername;
  if (usernameDisplay) usernameDisplay.textContent = formattedUsername;
  if (userAvatar) userAvatar.textContent = formattedUsername.charAt(0);

  // ------------------------------
  // 4. Load This User's Movies
  // ------------------------------
  const allMovies = JSON.parse(localStorage.getItem("movies")) || [];

  const movies = allMovies.filter(
    (movie) => movie.ownerEmail === loggedInUser.email,
  );

  // Total Movies
  const totalMovies = document.getElementById("totalMovies");
  if (totalMovies) totalMovies.textContent = movies.length;

  // Total Genres
  const genres = [
    ...new Set(movies.map((movie) => movie.genre).filter(Boolean)),
  ];

  const totalGenres = document.getElementById("totalGenres");
  if (totalGenres) totalGenres.textContent = genres.length;

  // Favorite Movies
  const favorites = movies.filter((movie) => movie.favorite === true);

  const favoriteMovies = document.getElementById("favoriteMovies");
  if (favoriteMovies) favoriteMovies.textContent = favorites.length;

  // ------------------------------
  // 5. Display Latest Movie
  // ------------------------------
  const latestMovie = document.getElementById("latestMovie");
  const latestMoviePoster = document.getElementById("latestMoviePoster");
  const defaultPoster = "/Image/default-movie.webp";

  if (movies.length > 0) {
    const latest = movies[movies.length - 1];

    if (latestMovie) {
      latestMovie.textContent = latest.title || "Untitled Movie";
    }

    if (latestMoviePoster) {
      latestMoviePoster.src = latest.poster || defaultPoster;
      latestMoviePoster.alt = latest.title || "Movie poster";
    }
  } else {
    if (latestMovie) {
      latestMovie.textContent = "No movies yet. Add your first movie!";
    }

    if (latestMoviePoster) {
      latestMoviePoster.src = defaultPoster;
      latestMoviePoster.alt = "Default movie poster";
    }
  }

  // ------------------------------
  // 6. Logout Confirmation Modal
  // ------------------------------
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const cancelLogout = document.getElementById("cancelLogout");
  const confirmLogout = document.getElementById("confirmLogout");

  if (logoutBtn && logoutModal) {
    logoutBtn.addEventListener("click", () => {
      logoutModal.classList.remove("hidden");
      logoutModal.classList.add("flex");
    });
  }

  if (cancelLogout && logoutModal) {
    cancelLogout.addEventListener("click", () => {
      logoutModal.classList.add("hidden");
      logoutModal.classList.remove("flex");
    });
  }

  if (confirmLogout) {
    confirmLogout.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }

  // ------------------------------
  // 7. Mobile Sidebar
  // ------------------------------
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (sidebar && menuBtn && sidebarOverlay) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("-translate-x-full");
      sidebarOverlay.classList.toggle("hidden");
    });

    sidebarOverlay.addEventListener("click", () => {
      sidebar.classList.add("-translate-x-full");
      sidebarOverlay.classList.add("hidden");
    });
  }
}
