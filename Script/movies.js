const OMDB_API_KEY = "4ed081d3";
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "login.html";
}

const usernameDisplay = document.getElementById("usernameDisplay");
const userAvatar = document.getElementById("userAvatar");

if (loggedInUser) {
  const username =
    loggedInUser.username.charAt(0).toUpperCase() +
    loggedInUser.username.slice(1);
  usernameDisplay.textContent = username;
  userAvatar.textContent = username.charAt(0);
}

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

function saveMovies() {
  const allMovies = JSON.parse(localStorage.getItem("movies")) || [];

  const otherUsersMovies = allMovies.filter(
    (movie) => movie.ownerEmail !== loggedInUser.email,
  );

  localStorage.setItem(
    "movies",
    JSON.stringify([...otherUsersMovies, ...movies]),
  );
}

function displayMovies(movieArray = movies) {
  movieList.innerHTML = "";
  movieCount.textContent = movieArray.length;

  if (movieArray.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  movieArray.forEach(function (movie) {
    const movieCard = document.createElement("div");
    movieCard.className =
      "bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 transition";

    let posterHTML = "";

    if (movie.poster && movie.poster !== "N/A") {
      posterHTML = `
        <img
          src="${movie.poster}"
          alt="${movie.title}"
          class="w-full h-full object-cover"
        />
      `;
    } else {
      posterHTML = `
        <div class="h-full flex items-center justify-center bg-blue-950">
          <span class="text-6xl">🎬</span>
        </div>
      `;
    }
    movieCard.innerHTML = `
      <div class="h-64 bg-blue-950 overflow-hidden">
        ${posterHTML}
      </div>

      <div class="p-5">

        <div class="flex items-start justify-between gap-3">

          <h3 class="text-xl font-bold text-slate-800">
            ${movie.title}
          </h3>

          <button
            onclick="toggleFavorite(${movie.id})"
            class="text-2xl hover:scale-110 transition"
          >
            ${movie.favorite ? "❤️" : "♡"}
          </button>
        </div>
        <p class="text-blue-900 font-semibold mt-3">
          ${movie.genre}
        </p>
        <p class="text-slate-500 text-sm mt-1">
          Released: ${movie.releaseYear}
        </p>
        <div class="flex gap-3 mt-5">
          <button
            onclick="editMovie(${movie.id})"
            class="flex-1 bg-blue-100 text-blue-900 py-2 rounded-lg font-semibold hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            onclick="openDeleteModal(${movie.id})"
            class="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    `;
    movieList.appendChild(movieCard);
  });
}

async function getMovieFromOMDb(title) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
        title,
      )}`,
    );

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

movieForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const title = movieTitle.value.trim();
  const genre = movieGenre.value.trim();
  const releaseYear = movieReleaseYear.value.trim();

  if (title === "" || genre === "" || releaseYear === "") {
    return;
  }

  if (editingMovieId !== null) {
    const movie = movies.find(
      (movie) =>
        movie.id === editingMovieId && movie.ownerEmail === loggedInUser.email,
    );

    if (!movie) return;

    movie.title = title;
    movie.genre = genre;
    movie.releaseYear = releaseYear;

    editingMovieId = null;
  } else {
    const movieData = await getMovieFromOMDb(title);

    if (!movieData) return;

    const newMovie = {
      id: Date.now(),
      title: movieData.Title,
      genre: movieData.Genre,
      releaseYear: movieData.Year,
      poster: movieData.Poster,
      favorite: false,
      ownerEmail: loggedInUser.email,
    };

    movies.push(newMovie);
  }

  saveMovies();
  populateGenres();
  displayMovies();
  closeMovieModal();
  movieForm.reset();
});

document.getElementById("openAddMovie").addEventListener("click", function () {
  editingMovieId = null;

  document.getElementById("modalTitle").textContent = "Add Movie";

  movieForm.reset();

  movieModal.classList.remove("hidden");
});

function closeMovieModal() {
  movieModal.classList.add("hidden");
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
    (movie) => movie.id === id && movie.ownerEmail === loggedInUser.email,
  );

  if (!movie) return;

  editingMovieId = id;

  movieTitle.value = movie.title;
  movieGenre.value = movie.genre;
  movieReleaseYear.value = movie.releaseYear;
  document.getElementById("modalTitle").textContent = "Edit Movie";
  movieModal.classList.remove("hidden");
}

function openDeleteModal(id) {
  const movie = movies.find(
    (movie) => movie.id === id && movie.ownerEmail === loggedInUser.email,
  );

  if (!movie) return;
  deletingMovieId = id;
  deleteModal.classList.remove("hidden");
}

document.getElementById("cancelDelete").addEventListener("click", function () {
  deletingMovieId = null;

  deleteModal.classList.add("hidden");
});

document.getElementById("confirmDelete").addEventListener("click", function () {
  if (deletingMovieId === null) return;

  movies = movies.filter(
    (movie) =>
      !(
        movie.id === deletingMovieId && movie.ownerEmail === loggedInUser.email
      ),
  );

  saveMovies();
  populateGenres();
  displayMovies();
  deletingMovieId = null;
  deleteModal.classList.add("hidden");
});

function toggleFavorite(id) {
  const movie = movies.find(
    (movie) => movie.id === id && movie.ownerEmail === loggedInUser.email,
  );

  if (!movie) return;
  movie.favorite = !movie.favorite;
  saveMovies();
  displayMovies();
}

movieSearch.addEventListener("input", function () {
  const searchValue = movieSearch.value.toLowerCase().trim();
  const filteredMovies = movies.filter(function (movie) {
    return movie.title.toLowerCase().includes(searchValue);
  });

  displayMovies(filteredMovies);
});

function populateGenres() {
  const genres = [...new Set(movies.map((movie) => movie.genre))];

  genreFilter.innerHTML = `
    <option value="all">All Genres</option>
  `;

  genres.forEach(function (genre) {
    const option = document.createElement("option");

    option.value = genre;

    option.textContent = genre;

    genreFilter.appendChild(option);
  });
}

genreFilter.addEventListener("change", function () {
  const selectedGenre = genreFilter.value;

  if (selectedGenre === "all") {
    displayMovies();
    return;
  }

  const filteredMovies = movies.filter(
    (movie) => movie.genre === selectedGenre,
  );

  displayMovies(filteredMovies);
});

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

populateGenres();
displayMovies();

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
