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

const favoriteList = document.getElementById("favoriteList");

const emptyFavorites = document.getElementById("emptyFavorites");

const favoriteCount = document.getElementById("favoriteCount");

const usernameDisplay = document.getElementById("usernameDisplay");

const userAvatar = document.getElementById("userAvatar");

// ========================================
// USER AVATAR
// ========================================

if (loggedInUser.username) {
  const username =
    loggedInUser.username.charAt(0).toUpperCase() +
    loggedInUser.username.slice(1);

  usernameDisplay.textContent = username;

  userAvatar.textContent = username.charAt(0);
}
// ========================================
// GET MOVIES
// ========================================

let allMovies = JSON.parse(localStorage.getItem("movies")) || [];

// Only get movies that belong to the logged-in user
let movies = allMovies.filter(
  (movie) => movie.ownerEmail === loggedInUser.email,
);

// ========================================
// DISPLAY FAVORITES
// ========================================

function displayFavorites() {
  favoriteList.innerHTML = "";

  const favorites = movies.filter(function (movie) {
    return movie.favorite === true;
  });

  // Update count
  favoriteCount.textContent = favorites.length;

  // No favorites
  if (favorites.length === 0) {
    emptyFavorites.classList.remove("hidden");
    return;
  }

  emptyFavorites.classList.add("hidden");

  // Display favorite movies
  favorites.forEach(function (movie) {
    const movieCard = document.createElement("div");

    movieCard.className =
      "bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 transition";

    // ========================================
    // MOVIE POSTER
    // ========================================

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

    // ========================================
    // MOVIE CARD
    // ========================================

    movieCard.innerHTML = `

      <!-- Movie Poster -->

      <div class="h-64 bg-blue-950 overflow-hidden">
        ${posterHTML}
      </div>


      <!-- Movie Information -->

      <div class="p-5">

        <div class="flex items-start justify-between gap-3">

          <h3 class="text-xl font-bold text-slate-800">
            ${movie.title}
          </h3>

          <button
            onclick="removeFavorite(${movie.id})"
            class="text-2xl hover:scale-110 transition"
            title="Remove from favorites"
          >
            ❤️
          </button>

        </div>


        <p class="text-blue-900 font-semibold mt-3">
          ${movie.genre}
        </p>


        <p class="text-slate-500 text-sm mt-1">
          Released: ${movie.releaseYear}
        </p>


        <button
          onclick="removeFavorite(${movie.id})"
          class="w-full mt-5 bg-red-100 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
        >
          Remove Favorite
        </button>

      </div>

    `;

    favoriteList.appendChild(movieCard);
  });
}

// ========================================
// REMOVE FAVORITE
// ========================================

function removeFavorite(id) {
  const movie = movies.find(function (movie) {
    return movie.id === id;
  });

  if (!movie) return;

  movie.favorite = false;

  const allMovies = JSON.parse(localStorage.getItem("movies")) || [];

  const updatedMovies = allMovies.map(function (storedMovie) {
    if (
      storedMovie.id === id &&
      storedMovie.ownerEmail === loggedInUser.email
    ) {
      return movie;
    }

    return storedMovie;
  });

  localStorage.setItem("movies", JSON.stringify(updatedMovies));

  displayFavorites();
}
// ========================================
// LOGOUT MODAL
// ========================================

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
// ========================================
// INITIAL DISPLAY
// ========================================

displayFavorites();

// ========================================
// MOBILE SIDEBAR TOGGLE
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
