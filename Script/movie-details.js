"use strict";

// ========================================
// CONFIGURATION
// ========================================

const TMDB_API_KEY = "b88979e104561c49823fdeee3859d8c4";
const DEFAULT_POSTER = "/Image/default-movie.webp";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

// ========================================
// ELEMENTS
// ========================================

const movieDetails = document.getElementById("movieDetails");
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
}

const username =
  typeof loggedInUser?.username === "string"
    ? loggedInUser.username.trim()
    : "";

const formattedUsername = username
  ? username.charAt(0).toUpperCase() + username.slice(1)
  : "User";

if (usernameDisplay) {
  usernameDisplay.textContent = formattedUsername;
}

if (userAvatar) {
  userAvatar.textContent = formattedUsername.charAt(0);
}
// ========================================
// LOAD SELECTED MOVIE
// ========================================

const urlParams = new URLSearchParams(window.location.search);
const movieId = Number(urlParams.get("id"));

const savedMovies = JSON.parse(localStorage.getItem("movies") || "[]");

const movie = savedMovies.find((item) => {
  if (!item || Number(item.id) !== movieId) {
    return false;
  }

  // Respect ownership when the movie has an owner assigned.
  if (item.ownerEmail && item.ownerEmail !== loggedInUser.email) {
    return false;
  }

  return true;
});

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

function showMovieMessage(message) {
  movieDetails.innerHTML = `
    <div class="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D6AD60]/10 text-[#D6AD60]">
        <i data-lucide="clapperboard" class="h-8 w-8"></i>
      </div>

      <h2 class="mb-2 text-xl font-bold text-[#F1F1F1]">
        Movie Not Found
      </h2>

      <p class="max-w-md text-sm leading-6 text-[#A6AAB3]">
        ${escapeHTML(message)}
      </p>

      <a
        href="movies.html"
        class="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D6AD60] px-5 py-3 text-sm font-semibold text-[#121418] transition hover:bg-[#E8C783]"
      >
        <i data-lucide="arrow-left" class="h-4 w-4"></i>
        Return to Movies
      </a>
    </div>
  `;

  refreshIcons();
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
// DISPLAY MOVIE DETAILS
// ========================================

function displayMovieDetails() {
  if (!Number.isFinite(movieId) || movieId <= 0 || !movie) {
    showMovieMessage(
      "We couldn't find this movie in your collection. Return to your Movies page and select a movie to view its details.",
    );

    return;
  }

  const title = escapeHTML(movie.title || "Untitled Movie");
  const genre = escapeHTML(movie.genre || "Genre not specified");
  const releaseYear = escapeHTML(movie.releaseYear || "Unknown");
  const description = escapeHTML(
    movie.description || "No description is available for this movie yet.",
  );

  const poster = escapeHTML(getPosterUrl(movie.poster));

  movieDetails.innerHTML = `
    <div class="grid grid-cols-1 gap-0 lg:grid-cols-3">

      <!-- Movie Poster -->
      <div class="bg-[#15181E] p-5 sm:p-7 lg:col-span-1">
        <div class="mx-auto max-w-sm overflow-hidden rounded-2xl border border-[#343840] bg-[#121418] shadow-lg">
          <img
            id="moviePoster"
            src="${poster}"
            alt="${title} poster"
            class="max-h-162.5 w-full object-contain"
          />
        </div>

        <div class="mt-5 flex items-center gap-2 text-sm text-[#A6AAB3]">
          <i data-lucide="calendar-days" class="h-4 w-4 text-[#D6AD60]"></i>
          <span>Release year: ${releaseYear}</span>
        </div>
      </div>

      <!-- Movie Information -->
      <div class="p-5 sm:p-7 lg:col-span-2 lg:p-9">

        <div class="mb-6">
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#D6AD60]">
            Movie overview
          </p>

          <h2 class="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            ${title}
          </h2>

          <div class="mt-5 flex flex-wrap items-center gap-3">
            <span class="inline-flex items-center gap-2 rounded-full border border-[#D6AD60]/30 bg-[#D6AD60]/10 px-4 py-2 text-sm font-medium text-[#D6AD60]">
              <i data-lucide="film" class="h-4 w-4"></i>
              ${genre}
            </span>

            <span class="inline-flex items-center gap-2 rounded-full border border-[#343840] bg-[#121418] px-4 py-2 text-sm text-[#A6AAB3]">
              <i data-lucide="calendar" class="h-4 w-4"></i>
              ${releaseYear}
            </span>
          </div>
        </div>

        <div class="border-t border-[#343840] pt-6">
          <h3 class="mb-3 flex items-center gap-2 text-lg font-semibold">
            <i data-lucide="book-open" class="h-5 w-5 text-[#D6AD60]"></i>
            Synopsis
          </h3>

          <p class="whitespace-pre-line text-sm leading-7 text-[#A6AAB3] sm:text-base">
            ${description}
          </p>
        </div>

        <!-- Trailer -->
        <div class="mt-9 border-t border-[#343840] pt-7">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D6AD60]/10 text-[#D6AD60]">
              <i data-lucide="play-circle" class="h-6 w-6"></i>
            </div>

            <div>
              <h3 class="text-xl font-bold">Official Trailer</h3>
              <p class="mt-1 text-sm text-[#A6AAB3]">
                Watch the movie preview.
              </p>
            </div>
          </div>

          <div
            id="trailerContainer"
            class="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-[#343840] bg-[#121418] text-center"
          >
            <div class="p-6 text-[#A6AAB3]">
              <i data-lucide="loader-circle" class="mx-auto mb-3 h-8 w-8 animate-spin text-[#D6AD60]"></i>
              <p class="text-sm">Searching for the trailer...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  refreshIcons();

  const posterElement = document.getElementById("moviePoster");

  posterElement.addEventListener("error", function () {
    if (posterElement.src.endsWith(DEFAULT_POSTER)) {
      return;
    }

    posterElement.src = DEFAULT_POSTER;
  });

  loadMovieTrailer(movie.title);
}

// ========================================
// TMDB TRAILER SEARCH
// ========================================

async function findTmdbMovie(title) {
  const searchUrl = new URL("https://api.themoviedb.org/3/search/movie");

  searchUrl.searchParams.set("api_key", TMDB_API_KEY);
  searchUrl.searchParams.set("query", title);

  const response = await fetch(searchUrl);

  if (!response.ok) {
    throw new Error("Unable to search for this movie.");
  }

  const data = await response.json();

  return data.results?.[0] || null;
}

async function findMovieTrailer(tmdbMovieId) {
  const videosUrl = new URL(
    `https://api.themoviedb.org/3/movie/${tmdbMovieId}/videos`,
  );

  videosUrl.searchParams.set("api_key", TMDB_API_KEY);

  const response = await fetch(videosUrl);

  if (!response.ok) {
    throw new Error("Unable to load trailer information.");
  }

  const data = await response.json();
  const youtubeVideos = (data.results || []).filter(
    (video) => video.site === "YouTube" && video.key,
  );

  return (
    youtubeVideos.find(
      (video) => video.type === "Trailer" && video.official === true,
    ) ||
    youtubeVideos.find(
      (video) => video.type === "Teaser" && video.official === true,
    ) ||
    youtubeVideos.find((video) => video.type === "Trailer") ||
    youtubeVideos.find((video) => video.type === "Teaser") ||
    null
  );
}

async function loadMovieTrailer(title) {
  const trailerContainer = document.getElementById("trailerContainer");

  if (!trailerContainer) {
    return;
  }

  try {
    const tmdbMovie = await findTmdbMovie(title);

    if (!tmdbMovie) {
      showTrailerMessage("No trailer was found for this movie.");
      return;
    }

    const trailer = await findMovieTrailer(tmdbMovie.id);

    if (!trailer) {
      showTrailerMessage("A trailer is not currently available.");
      return;
    }

    const iframe = document.createElement("iframe");

    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}`;
    iframe.title = `${title} trailer`;
    iframe.className = "h-full w-full";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";

    trailerContainer.replaceChildren(iframe);
  } catch (error) {
    console.error("Trailer loading error:", error);

    showTrailerMessage(
      "We couldn't load the trailer right now. Please check your internet connection and try again later.",
    );
  }
}

function showTrailerMessage(message) {
  const trailerContainer = document.getElementById("trailerContainer");

  if (!trailerContainer) {
    return;
  }

  trailerContainer.innerHTML = `
    <div class="p-6 text-center">
      <i data-lucide="video-off" class="mx-auto mb-3 h-8 w-8 text-[#A6AAB3]"></i>
      <p class="text-sm leading-6 text-[#A6AAB3]">
        ${escapeHTML(message)}
      </p>
    </div>
  `;

  refreshIcons();
}

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

// ========================================
// INITIALIZE PAGE
// ========================================

displayMovieDetails();
