const apiKey = 'c39d18a7';
const baseUrl = 'https://www.omdbapi.com/';

async function searchMovies() {
  const query = document.getElementById('searchInput').value.trim();
  
  if (!query) {
    showNotification('Please enter a search term', 'error');
    return;
  }

  // Show loading state
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('movies').innerHTML = '';
  document.getElementById('noResults').classList.add('hidden');

  try {
    const response = await fetch(`${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Hide loading state
    document.getElementById('loading').classList.add('hidden');
    
    if (data.Response === "True" && data.Search && data.Search.length > 0) {
      showMovies(data.Search);
    } else {
      document.getElementById('noResults').classList.remove('hidden');
      if (data.Error) {
        showNotification(data.Error, 'error');
      }
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    document.getElementById('loading').classList.add('hidden');
    showNotification('Failed to fetch movies. Please try again.', 'error');
  }
}

function showMovies(movies) {
  const moviesDiv = document.getElementById('movies');
  moviesDiv.innerHTML = '';

  movies.forEach((movie, index) => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.style.animationDelay = `${index * 0.1}s`;

    const poster = movie.Poster !== "N/A"
      ? movie.Poster
      : 'https://via.placeholder.com/300x450/1a1a1a/cccccc?text=No+Poster';
    
    const typeBadge = movie.Type 
      ? `<span class="type-badge type-${movie.Type}">${movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}</span>`
      : '';

    movieEl.innerHTML = `
      <div class="h-full flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div class="relative pt-[150%] overflow-hidden">
          <img 
            src="${poster}" 
            alt="${movie.Title}" 
            class="absolute top-0 left-0 w-full h-full object-cover"
            loading="lazy"
          >
        </div>
        <div class="p-4 flex-grow flex flex-col">
          <h3 class="text-white font-semibold mb-2 line-clamp-2">${movie.Title}</h3>
          <div class="mt-auto text-sm text-gray-400 flex justify-between items-center">
            <span>${movie.Year}</span>
            ${typeBadge}
          </div>
        </div>
      </div>
    `;

    // Add click event to show more details
    movieEl.addEventListener('click', () => {
      showMovieDetails(movie.imdbID);
    });

    moviesDiv.appendChild(movieEl);
  });
}

async function showMovieDetails(imdbID) {
  try {
    const response = await fetch(`${baseUrl}?apikey=${apiKey}&i=${imdbID}&plot=full`);
    const data = await response.json();
    
    if (data.Response === "True") {
      // Create modal with movie details
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="relative">
            <button class="absolute top-4 right-4 text-white bg-gray-700 rounded-full p-2 z-10 hover:bg-gray-600">
              <i class="fas fa-times"></i>
            </button>
            <div class="grid md:grid-cols-3 gap-6 p-6">
              <div class="md:col-span-1">
                <img 
                  src="${data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/300x450/1a1a1a/cccccc?text=No+Poster'}" 
                  alt="${data.Title}" 
                  class="w-full rounded-lg shadow-lg"
                >
              </div>
              <div class="md:col-span-2">
                <h2 class="text-2xl font-bold text-white mb-2">${data.Title} (${data.Year})</h2>
                <div class="flex flex-wrap gap-2 mb-4">
                  ${data.Rated && data.Rated !== "N/A" ? `<span class="bg-blue-500 text-white px-2 py-1 rounded text-xs">${data.Rated}</span>` : ''}
                  ${data.Runtime && data.Runtime !== "N/A" ? `<span class="bg-gray-600 text-white px-2 py-1 rounded text-xs">${data.Runtime}</span>` : ''}
                  ${data.Genre && data.Genre !== "N/A" ? `<span class="bg-purple-500 text-white px-2 py-1 rounded text-xs">${data.Genre}</span>` : ''}
                </div>
                <p class="text-gray-300 mb-4">${data.Plot !== "N/A" ? data.Plot : 'No plot available'}</p>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  ${data.Director && data.Director !== "N/A" ? `<div><span class="text-gray-400">Director:</span> <span class="text-white">${data.Director}</span></div>` : ''}
                  ${data.Writer && data.Writer !== "N/A" ? `<div><span class="text-gray-400">Writer:</span> <span class="text-white">${data.Writer}</span></div>` : ''}
                  ${data.Actors && data.Actors !== "N/A" ? `<div><span class="text-gray-400">Actors:</span> <span class="text-white">${data.Actors}</span></div>` : ''}
                  ${data.Language && data.Language !== "N/A" ? `<div><span class="text-gray-400">Language:</span> <span class="text-white">${data.Language}</span></div>` : ''}
                  ${data.Country && data.Country !== "N/A" ? `<div><span class="text-gray-400">Country:</span> <span class="text-white">${data.Country}</span></div>` : ''}
                  ${data.imdbRating && data.imdbRating !== "N/A" ? `<div><span class="text-gray-400">IMDb Rating:</span> <span class="text-white">${data.imdbRating}/10</span></div>` : ''}
                </div>
                ${data.Website && data.Website !== "N/A" ? `
                  <div class="mt-4">
                    <a href="${data.Website}" target="_blank" class="text-blue-400 hover:text-blue-300">
                      <i class="fas fa-external-link-alt mr-2"></i>Official Website
                    </a>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add close functionality
      modal.querySelector('button').addEventListener('click', () => {
        modal.remove();
      });
      
      // Add to document
      document.body.appendChild(modal);
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    showNotification('Failed to load movie details', 'error');
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === 'error' ? 'bg-red-600' : 'bg-green-600'
  } text-white font-semibold animate-fade-in`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.remove('animate-fade-in');
    notification.classList.add('animate-fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize with popular movies when page loads
window.addEventListener('DOMContentLoaded', async () => {
  try {
    document.getElementById('loading').classList.remove('hidden');
    const response = await fetch(`${baseUrl}?apikey=${apiKey}&s=avengers`);
    const data = await response.json();
    document.getElementById('loading').classList.add('hidden');
    
    if (data.Response === "True" && data.Search && data.Search.length > 0) {
      showMovies(data.Search.slice(0, 10)); // Show first 10 results
    }
  } catch (error) {
    console.error('Error loading initial movies:', error);
    document.getElementById('loading').classList.add('hidden');
  }
});