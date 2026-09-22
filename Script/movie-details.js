const TMDB_API_KEY = "b88979e104561c49823fdeee3859d8c4";

const urlParams = new URLSearchParams(window.location.search);
const movieId = Number(urlParams.get("id"));

console.log("Movie ID:", movieId);

const movies = JSON.parse(localStorage.getItem("movies")) || [];
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

const movie = movies.find((movie) => movie.id === movieId);
console.log("Selected movie:", movie);

const movieDetails = document.getElementById("movieDetails");
async function findTmdbMovie(title) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`,
  );

  const usernameDisplay = document.getElementById("usernameDisplay");
  const userAvatar = document.getElementById("userAvatar");

  if (loggedInUser) {
    const username =
      loggedInUser.username.charAt(0).toUpperCase() +
      loggedInUser.username.slice(1);

    usernameDisplay.textContent = username;
    userAvatar.textContent = username.charAt(0);
  }

  const data = await response.json();

  console.log("TMDB movie search:", data);

  return data.results[0];
}

findTmdbMovie(movie.title).then((tmdbMovie) => {
  console.log("Matched TMDB movie:", tmdbMovie);

  fetch(
    `https://api.themoviedb.org/3/movie/${tmdbMovie.id}/videos?api_key=${TMDB_API_KEY}`,
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("TMDB movie videos:", data);
      const trailer = data.results.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.official === true,
      );
      console.log("Selected trailer:", trailer);
      const trailerContainer = document.getElementById("trailerContainer");

      if (trailer) {
        trailerContainer.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${trailer.key}"
      title="${movie.title} Trailer"
      class="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
      } else {
        trailerContainer.innerHTML = `
    <p class="text-slate-400">
      Trailer not available.
    </p>
  `;
      }
    })

    .catch((error) => {
      console.error("TMDB video error:", error);
    });
});

movieDetails.innerHTML = `
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

    <!-- Poster -->

    <div class="lg:col-span-1">
      <div class="bg-blue-950 rounded-2xl overflow-hidden shadow-lg h-full min-h-125">
        <img
          src="${movie.poster}"
          alt="${movie.title}"
          class="w-full h-full object-cover"
          onerror="this.onerror=null; this.src='/image/default-movie.webp';"
        />
      </div>
    </div>

    <!-- Movie Content -->

    <div class="lg:col-span-2">

      <!-- Movie Information -->

      <div class="bg-white rounded-2xl shadow-lg p-7">
        <h1 class="text-4xl font-bold text-slate-800">
          ${movie.title}
        </h1>
        <p class="text-blue-900 font-semibold mt-4">
          ${movie.genre}
        </p>
        <p class="text-slate-500 text-sm mt-1">
          Released: ${movie.releaseYear}
        </p>
        <p class="text-slate-600 leading-7 mt-6">
         ${movie.description || "No description available."}
        </p>
      </div>

      <!-- Trailer -->

      <div class="bg-white rounded-2xl shadow-lg p-7 mt-6">
        <h2 class="text-2xl font-bold text-slate-800">
          Trailer
        </h2>
        <div
  id="trailerContainer"
  class="mt-4 aspect-video bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden"
     >
     <p class="text-slate-400">
        Loading trailer...
     </p>
       </div>
      </div>
    </div>
  </div>
`;
