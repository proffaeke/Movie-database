const urlParams = new URLSearchParams(window.location.search);
const movieId = Number(urlParams.get("id"));

console.log("Movie ID:", movieId);

const movies = JSON.parse(localStorage.getItem("movies")) || [];
const movie = movies.find((movie) => movie.id === movieId);

console.log("Selected movie:", movie);

const movieDetails = document.getElementById("movieDetails");
movieDetails.innerHTML = `
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

    <!-- Poster -->
    <div class="lg:col-span-1">
      <div class="bg-blue-950 rounded-2xl overflow-hidden shadow-lg h-full min-h-[500px]">
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
          class="mt-4 aspect-video bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden"
        >
          <p class="text-slate-400">
            Trailer coming soon
          </p>
        </div>
      </div>
    </div>
  </div>
`;
