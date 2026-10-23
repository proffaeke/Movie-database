"use strict";

const OMDB_API_KEY = "4ed081d3";
const DEFAULT_POSTER = "/Image/default-movie.webp";

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "../index.html";
} else {
  // ------------------------------
  // 1. Initialize Lucide Icons
  // ------------------------------
  function refreshIcons() {
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  refreshIcons();

  // ------------------------------
  // 2. User Information
  // ------------------------------
  const usernameDisplay = document.getElementById("usernameDisplay");
  const userAvatar = document.getElementById("userAvatar");

  const username = loggedInUser.username || "User";
  const formattedUsername =
    username.charAt(0).toUpperCase() + username.slice(1);

  if (usernameDisplay) usernameDisplay.textContent = formattedUsername;
  if (userAvatar) userAvatar.textContent = formattedUsername.charAt(0);

  // ------------------------------
  // 3. Page Elements and Movie Data
  // ------------------------------
  const movieList = document.getElementById("movieList");
  const movieCount = document.getElementById("movieCount");
  const emptyState = document.getElementById("emptyState");
  const movieModal = document.getElementById("movieModal");
  const deleteModal = document.getElementById("deleteModal");
  const movieForm = document.getElementById("movieForm");
  const movieTitle = document.getElementById("movieTitle");
  const movieGenre = document.getElementById("movieGenre");
  const movieReleaseYear = document.getElementById("movieReleaseYear");
  const movieSearch = document.getElementById("movieSearch");
  const genreFilter = document.getElementById("genreFilter");

  let allMovies = JSON.parse(localStorage.getItem("movies")) || [];
  let movies = allMovies.filter(
    (movie) => movie.ownerEmail === loggedInUser.email,
  );

  let editingMovieId = null;
  let deletingMovieId = null;

  // ------------------------------
  // 4. Save Movies
  // ------------------------------
  function saveMovies() {
    const storedMovies = JSON.parse(localStorage.getItem("movies")) || [];

    const otherUsersMovies = storedMovies.filter(
      (movie) => movie.ownerEmail !== loggedInUser.email,
    );

    localStorage.setItem(
      "movies",
      JSON.stringify([...otherUsersMovies, ...movies]),
    );
  }

  // ------------------------------
  // 5. Search and Genre Filtering
  // ------------------------------
  function getFilteredMovies() {
    const searchValue = movieSearch.value.toLowerCase().trim();
    const selectedGenre = genreFilter.value;

    return movies.filter((movie) => {
      const matchesTitle = (movie.title || "")
        .toLowerCase()
        .includes(searchValue);

      const matchesGenre =
        selectedGenre === "all" || movie.genre === selectedGenre;

      return matchesTitle && matchesGenre;
    });
  }

  // ------------------------------
  // 6. Display Movie Cards
  // ------------------------------
  function displayMovies(movieArray = getFilteredMovies()) {
    movieList.innerHTML = "";
    movieCount.textContent = movieArray.length;

    if (movieArray.length === 0) {
      emptyState.classList.remove("hidden");
      refreshIcons();
      return;
    }

    emptyState.classList.add("hidden");

    movieArray.forEach((movie) => {
      const movieCard = document.createElement("article");

      movieCard.className =
        "overflow-hidden rounded-2xl border border-[#343840] bg-[#1C2027] transition duration-300 hover:-translate-y-1 hover:border-[#D6AD60]/50";

      const poster =
        movie.poster && movie.poster !== "N/A" ? movie.poster : DEFAULT_POSTER;

      const safeTitle = escapeHTML(movie.title || "Untitled Movie");
      const safeGenre = escapeHTML(movie.genre || "Unknown genre");
      const safeYear = escapeHTML(movie.releaseYear || "Unknown");

      movieCard.innerHTML = `
        <div class="group relative h-64 overflow-hidden bg-[#121418]">
          <img
            src="${escapeHTML(poster)}"
            alt="${safeTitle}"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

          <button
            type="button"
            data-action="favorite"
            data-id="${movie.id}"
            aria-label="${movie.favorite ? "Remove from favorites" : "Add to favorites"}"
            aria-pressed="${Boolean(movie.favorite)}"
            class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
          >
            <i data-lucide="heart" class="h-5 w-5 ${movie.favorite ? "fill-[#D6AD60] text-[#D6AD60]" : ""}"></i>
          </button>

          <span class="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            ${safeYear}
          </span>
        </div>

        <div class="p-5">
          <h3 class="truncate text-lg font-bold text-[#F1F1F1]" title="${safeTitle}">
            ${safeTitle}
          </h3>

          <p class="mt-2 truncate text-sm font-medium text-[#D6AD60]">
            ${safeGenre}
          </p>

          <div class="mt-5 flex flex-col gap-2">
            <button
              type="button"
              data-action="details"
              data-id="${movie.id}"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D6AD60] py-2.5 font-semibold text-[#121418] transition hover:bg-[#E5C47E]"
            >
              <i data-lucide="info" class="h-4 w-4"></i>
              View Details
            </button>

            <div class="flex gap-2">
              <button
                type="button"
                data-action="edit"
                data-id="${movie.id}"
                class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#343840] py-2.5 text-sm font-semibold text-[#D9DCE2] transition hover:border-[#D6AD60]/50 hover:bg-[#343840]"
              >
                <i data-lucide="pencil" class="h-4 w-4"></i>
                Edit
              </button>

              <button
                type="button"
                data-action="delete"
                data-id="${movie.id}"
                class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                <i data-lucide="trash-2" class="h-4 w-4"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      `;

      const posterImage = movieCard.querySelector("img");

      posterImage.addEventListener("error", () => {
        posterImage.onerror = null;
        posterImage.src = DEFAULT_POSTER;
      });

      movieList.appendChild(movieCard);
    });

    refreshIcons();
  }

  // Escape values inserted into HTML attributes and content.
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
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

  // ------------------------------
  // 7. Movie Details
  // ------------------------------
  function viewMovie(id) {
    const movie = movies.find(
      (item) => item.id === id && item.ownerEmail === loggedInUser.email,
    );

    if (!movie) return;

    window.location.href = `movie-details.html?id=${movie.id}`;
  }

  // ------------------------------
  // 8. Fetch Movie Details from OMDb
  // ------------------------------
  async function getMovieFromOMDb(title) {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`,
      );

      if (!response.ok) {
        throw new Error("Movie service request failed.");
      }

      const data = await response.json();

      if (data.Response === "False") {
        alert("Movie not found. Please check the movie title.");
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching movie:", error);
      alert("Something went wrong while searching for the movie.");
      return null;
    }
  }

  // ------------------------------
  // 9. Add or Edit Movie
  // ------------------------------
  movieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = movieTitle.value.trim();
    const genre = movieGenre.value.trim();
    const releaseYear = movieReleaseYear.value.trim();

    if (!title || !genre || !releaseYear) return;

    const year = Number(releaseYear);

    if (!Number.isInteger(year) || year < 1888 || year > 2100) {
      alert("Please enter a valid release year.");
      return;
    }

    if (editingMovieId !== null) {
      const movie = movies.find(
        (item) =>
          item.id === editingMovieId && item.ownerEmail === loggedInUser.email,
      );

      if (!movie) return;

      movie.title = title;
      movie.genre = genre;
      movie.releaseYear = releaseYear;
    } else {
      const movieData = await getMovieFromOMDb(title);

      if (!movieData) return;

      const newMovie = {
        id: Date.now(),
        title: movieData.Title || title,
        genre:
          movieData.Genre && movieData.Genre !== "N/A"
            ? movieData.Genre
            : genre,
        releaseYear:
          movieData.Year && movieData.Year !== "N/A"
            ? movieData.Year
            : releaseYear,
        description: movieData.Plot || "",
        poster: movieData.Poster || DEFAULT_POSTER,
        trailer: "",
        favorite: false,
        ownerEmail: loggedInUser.email,
      };

      movies.push(newMovie);
    }

    saveMovies();
    populateGenres();
    displayMovies();
    closeMovieModal();
  });

  // ------------------------------
  // 10. Add / Edit Modal
  // ------------------------------
  document.getElementById("openAddMovie").addEventListener("click", () => {
    editingMovieId = null;
    document.getElementById("modalTitle").textContent = "Add Movie";
    movieForm.reset();
    movieModal.classList.remove("hidden");
    movieModal.classList.add("flex");
  });

  function closeMovieModal() {
    movieModal.classList.add("hidden");
    movieModal.classList.remove("flex");
    movieForm.reset();
    editingMovieId = null;
  }

  document
    .getElementById("closeMovieModal")
    .addEventListener("click", closeMovieModal);

  document
    .getElementById("cancelMovie")
    .addEventListener("click", closeMovieModal);

  function editMovie(id) {
    const movie = movies.find(
      (item) => item.id === id && item.ownerEmail === loggedInUser.email,
    );

    if (!movie) return;

    editingMovieId = id;
    movieTitle.value = movie.title || "";
    movieGenre.value = movie.genre || "";
    movieReleaseYear.value = movie.releaseYear || "";
    document.getElementById("modalTitle").textContent = "Edit Movie";

    movieModal.classList.remove("hidden");
    movieModal.classList.add("flex");
  }

  // ------------------------------
  // 11. Delete Movie
  // ------------------------------
  function openDeleteModal(id) {
    const movie = movies.find(
      (item) => item.id === id && item.ownerEmail === loggedInUser.email,
    );

    if (!movie) return;

    deletingMovieId = id;
    deleteModal.classList.remove("hidden");
    deleteModal.classList.add("flex");
  }

  document.getElementById("cancelDelete").addEventListener("click", () => {
    deletingMovieId = null;
    deleteModal.classList.add("hidden");
    deleteModal.classList.remove("flex");
  });

  document.getElementById("confirmDelete").addEventListener("click", () => {
    if (deletingMovieId === null) return;

    movies = movies.filter(
      (movie) =>
        !(
          movie.id === deletingMovieId &&
          movie.ownerEmail === loggedInUser.email
        ),
    );

    saveMovies();
    populateGenres();
    displayMovies();

    deletingMovieId = null;
    deleteModal.classList.add("hidden");
    deleteModal.classList.remove("flex");
  });

  // ------------------------------
  // 12. Favorites
  // ------------------------------
  function toggleFavorite(id) {
    const movie = movies.find(
      (item) => item.id === id && item.ownerEmail === loggedInUser.email,
    );

    if (!movie) return;

    movie.favorite = !movie.favorite;
    saveMovies();
    displayMovies();
  }

  // Delegate actions for dynamically generated movie cards.
  movieList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "favorite") toggleFavorite(id);
    if (action === "details") viewMovie(id);
    if (action === "edit") editMovie(id);
    if (action === "delete") openDeleteModal(id);
  });

  // ------------------------------
  // 13. Search and Genre Events
  // ------------------------------
  movieSearch.addEventListener("input", () => displayMovies());

  genreFilter.addEventListener("change", () => displayMovies());

  function populateGenres() {
    const selectedGenre = genreFilter.value;
    const genres = [
      ...new Set(movies.map((movie) => movie.genre).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));

    genreFilter.innerHTML = '<option value="all">All Genres</option>';

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genreFilter.appendChild(option);
    });

    genreFilter.value = genres.includes(selectedGenre) ? selectedGenre : "all";
  }

  // ------------------------------
  // 14. Logout Confirmation
  // ------------------------------
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const cancelLogout = document.getElementById("cancelLogout");
  const confirmLogout = document.getElementById("confirmLogout");

  logoutBtn.addEventListener("click", () => {
    logoutModal.classList.remove("hidden");
    logoutModal.classList.add("flex");
  });

  cancelLogout.addEventListener("click", () => {
    logoutModal.classList.add("hidden");
    logoutModal.classList.remove("flex");
  });

  confirmLogout.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });

  // ------------------------------
  // 15. Mobile Sidebar
  // ------------------------------
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
    sidebarOverlay.classList.toggle("hidden");
  });

  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
    sidebarOverlay.classList.add("hidden");
  });

  // Initial Render
  populateGenres();
  displayMovies();
}
