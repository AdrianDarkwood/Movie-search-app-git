const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your TMDB API key
const baseUrl = 'https://api.themoviedb.org/3/search/movie';

async function searchMovies() {
  const query = document.getElementById('searchInput').value;
  const response = await fetch(`${baseUrl}?api_key=${apiKey}&query=${query}`);
  const data = await response.json();
  showMovies(data.results);
}

function showMovies(movies) {
  const moviesDiv = document.getElementById('movies');
  moviesDiv.innerHTML = '';

  if (!movies || movies.length === 0) {
    moviesDiv.innerHTML = '<p>No movies found.</p>';
    return;
  }

  movies.forEach(movie => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/150x225?text=No+Image';

    movieEl.innerHTML = `
      <img src="${poster}" alt="${movie.title}">
      <div class="movie-info">
        <h4>${movie.title}</h4>
        <p>⭐ ${movie.vote_average || 'N/A'} | 📅 ${movie.release_date || 'N/A'}</p>
      </div>
    `;

    moviesDiv.appendChild(movieEl);
  });
}
