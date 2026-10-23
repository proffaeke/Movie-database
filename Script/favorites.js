"use strict";

// ========================================
// CONFIGURATION
// ========================================

const DEFAULT_POSTER = "/Image/default-movie.webp";

// ========================================
// ELEMENTS
// ========================================

const favoriteList = document.getElementById("favoriteList");
const emptyFavorites = document.getElementById("emptyFavorites");
const favoriteCount = document.getElementById("favoriteCount");

const usernameDisplay = document.getElementById("usernameDisplay");
const userAvatar = document.getElementById("userAvatar");

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");

// ========================================
// AUTHENTICATION
// ========================================

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

if (!loggedInUser) {
  window.location.href = "login.html";
} else {
  initializeFavoritesPage();
}

// ========================================
// INITIALIZE PAGE
// ========================================

function initializeFavoritesPage() {
  updateUserDisplay();
  displayFavorites();
  initializeSidebar();
  initializeLogout();
}

// ========================================
// USER DISPLAY
// ========================================

function updateUserDisplay() {
  const rawUsername =
    typeof loggedInUser.username === "string"
      ? loggedInUser.username.trim()
      : "";

  const formattedUsername = rawUsername
    ? rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1)
    : "User";

  usernameDisplay.textContent = formattedUsername;
  userAvatar.textContent = formattedUsername.charAt(0);
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function getAllMovies() {
  const storedMovies = JSON.parse(localStorage.getItem("movies") || "[]");

  return Array.isArray(storedMovies) ? storedMovies : [];
}

function getUserMovies() {
  return getAllMovies().filter(
    (movie) => movie.ownerEmail === loggedInUser.email,
  );
}

function getPosterUrl(poster) {
  if (
    typeof poster === "string" &&
    /^https?:\/\//i.test(poster) &&
    poster !== "N/A"
  ) {
    return poster;
  }

  return DEFAULT_POSTER;
}

// ========================================
// DISPLAY FAVORITES
// ========================================

function displayFavorites() {
  const favorites = getUserMovies().filter((movie) => movie.favorite === true);

  favoriteCount.textContent = favorites.length;
  favoriteList.innerHTML = "";

  if (favorites.length === 0) {
    emptyFavorites.classList.remove("hidden");
    refreshIcons();
    return;
  }

  emptyFavorites.classList.add("hidden");

  favorites.forEach((movie) => {
    const movieCard = document.createElement("article");

    movieCard.className =
      "overflow-hidden rounded-2xl border border-[#343840] bg-[#1C2027] transition duration-300 hover:-translate-y-1 hover:border-[#D6AD60]/40";

    const title = escapeHTML(movie.title || "Untitled Movie");
    const genre = escapeHTML(movie.genre || "Genre not specified");
    const releaseYear = escapeHTML(movie.releaseYear || "Unknown");
    const poster = escapeHTML(getPosterUrl(movie.poster));
    const movieId = escapeHTML(movie.id);

    movieCard.innerHTML = `
      <!-- Movie Poster -->
      <div class="relative h-64 overflow-hidden bg-[#15181E]">
        <img
          src="${poster}"
          alt="${title} poster"
          class="h-full w-full object-cover"
          loading="lazy"
        />

        <span
          class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-[#D6AD60] backdrop-blur-sm"
          aria-label="Favorite movie"
        >
          <i data-lucide="heart" class="h-5 w-5 fill-current"></i>
        </span>
      </div>

      <!-- Movie Information -->
      <div class="p-5">
        <h3
          class="truncate text-lg font-bold text-[#F1F1F1]"
          title="${title}"
        >
          ${title}
        </h3>

        <p class="mt-3 text-sm font-medium text-[#D6AD60]">
          ${genre}
        </p>

        <p class="mt-2 flex items-center gap-2 text-sm text-[#A6AAB3]">
          <i data-lucide="calendar-days" class="h-4 w-4"></i>
          Released: ${releaseYear}
        </p>

        <div class="mt-5 grid grid-cols-2 gap-3">
          <a
            href="movie-details.html?id=${encodeURIComponent(String(movie.id))}"
            class="flex items-center justify-center gap-2 rounded-xl border border-[#343840] px-3 py-2.5 text-sm font-semibold text-[#F1F1F1] transition hover:bg-[#272C35]"
          >
            <i data-lucide="eye" class="h-4 w-4"></i>
            Details
          </a>

          <button
            type="button"
            data-remove-favorite="${movieId}"
            class="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
            aria-label="Remove ${title} from favorites"
          >
            <i data-lucide="heart-off" class="h-4 w-4"></i>
            Remove
          </button>
        </div>
      </div>
    `;

    const posterImage = movieCard.querySelector("img");

    posterImage.addEventListener("error", () => {
      if (!posterImage.src.endsWith(DEFAULT_POSTER)) {
        posterImage.src = DEFAULT_POSTER;
      }
    });

    favoriteList.appendChild(movieCard);
  });

  refreshIcons();
}

// ========================================
// REMOVE FAVORITE
// ========================================

function removeFavorite(id) {
  const allMovies = getAllMovies();

  const movieToUpdate = allMovies.find(
    (movie) =>
      String(movie.id) === String(id) &&
      movie.ownerEmail === loggedInUser.email,
  );

  if (!movieToUpdate) {
    return;
  }

  const updatedMovies = allMovies.map((movie) => {
    if (
      String(movie.id) === String(id) &&
      movie.ownerEmail === loggedInUser.email
    ) {
      return {
        ...movie,
        favorite: false,
      };
    }

    return movie;
  });

  localStorage.setItem("movies", JSON.stringify(updatedMovies));

  displayFavorites();
}

favoriteList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-favorite]");

  if (!removeButton) {
    return;
  }

  removeFavorite(removeButton.dataset.removeFavorite);
});

// ========================================
// MOBILE SIDEBAR
// ========================================

function openSidebar() {
  sidebar.classList.remove("-translate-x-full");
  sidebarOverlay.classList.remove("hidden");
  menuBtn.setAttribute("aria-expanded", "true");
}

function closeSidebar() {
  sidebar.classList.add("-translate-x-full");
  sidebarOverlay.classList.add("hidden");
  menuBtn.setAttribute("aria-expanded", "false");
}

function initializeSidebar() {
  menuBtn.addEventListener("click", () => {
    const isClosed = sidebar.classList.contains("-translate-x-full");

    if (isClosed) {
      openSidebar();
    } else {
      closeSidebar();
    }
  });

  sidebarOverlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
      closeLogoutModal();
    }
  });
}

// ========================================
// LOGOUT CONFIRMATION
// ========================================

function openLogoutModal() {
  logoutModal.classList.remove("hidden");
  logoutModal.classList.add("flex");
  cancelLogout.focus();
}

function closeLogoutModal() {
  logoutModal.classList.add("hidden");
  logoutModal.classList.remove("flex");
}

function initializeLogout() {
  logoutBtn.addEventListener("click", openLogoutModal);
  cancelLogout.addEventListener("click", closeLogoutModal);

  logoutModal.addEventListener("click", (event) => {
    if (event.target === logoutModal) {
      closeLogoutModal();
    }
  });

  confirmLogout.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });
}

// ========================================
// INITIALIZE LUCIDE ICONS
// ========================================

refreshIcons();
