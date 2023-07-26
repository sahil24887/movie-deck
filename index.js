let movies = [];
let currentPage = 1;
let totalPages = 0;
const moviesList = document.getElementById("movies-list");

function getMovieNamesFromLocalStorage() {
  const favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
  return favouriteMovies === null ? [] : favouriteMovies;
}

function addMovieNameToLocalStorage(movieName) {
  const favMoviesNames = getMovieNamesFromLocalStorage();
  localStorage.setItem(
    "favouriteMovies",
    JSON.stringify([...favMoviesNames, movieName])
  );
}

function removeMovieNameFromLocalStorage(movieName) {
  const favMoviesNames = getMovieNamesFromLocalStorage();
  localStorage.setItem(
    "favouriteMovies",
    JSON.stringify(favMoviesNames.filter((movName) => movName !== movieName))
  );
}

const renderMovies = (movies) => {
    let favMovieNameList = getMovieNamesFromLocalStorage();
    moviesList.innerHTML = "";
    movies.map((movie) => {
        const { poster_path, title, vote_count, vote_average } = movie;
        let listItem = document.createElement("li");
        listItem.className = "card";
        let imgSrc =
            poster_path
        ? `https://image.tmdb.org/t/p/original/${poster_path}`
        : "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";
        listItem.innerHTML += `
        <img
            class="poster"
            src=${imgSrc}
            alt="${title}"
        />
        <p class="title">${title}</p>
        <section class="vote-favouriteIcon">
        <section class="vote">
            <p class="vote-count">Votes: ${vote_count}</p>
            <p class="vote-average">Rating: ${vote_average}</p>
        </section>
        <i class="favorite-icon fa-regular fa-heart fa-2xl ${
        favMovieNameList.includes(title) ? "fa-solid" : null
        }" id="${title}"></i>
        </section>`;
        const favouriteIconBtn = listItem.querySelector(".favorite-icon");
        favouriteIconBtn.addEventListener("click", (event) => {
          const { id } = event.target;
          if (favouriteIconBtn.classList.contains("fa-solid")) {
            // removing movie name to the localStorage and from favourite array
            removeMovieNameFromLocalStorage(id);
            // DOM manipulation for removing the class on removing movie from the lcoalStorage
            favouriteIconBtn.classList.remove("fa-solid");
          } else {
            // Adding movie name to the localStorage and from favourite array
            addMovieNameToLocalStorage(id);
            // DOM manipulation for adding the class on removing movie from the lcoalStorage
            favouriteIconBtn.classList.add("fa-solid");
          }
        });
        moviesList.appendChild(listItem);
    });
};

// Declare a function to fetch the movies data from the API
async function fetchMovies(page) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`);
        const result = await response.json();
        movies = result.results;
        renderMovies(movies);
    } catch (error) {
        console.log(error);
    }
}

fetchMovies(currentPage);

// Flag for checking if the sort by date button clicking first time or not
let firstSortByDateClick = true;
const sortByDateButton = document.getElementById("sort-by-date");
// Declare a function to sort the movies by date
function sortByDate() {
    let sortedMovies;
    if (firstSortByDateClick) {
        // Use the sort function to create a new array of movies sorted by their release date in ascending order
        sortedMovies = movies.sort(
            (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );
        sortByDateButton.textContent = "Sort by date (latest to oldest)";
        firstSortByDateClick = false;
    } else if (!firstSortByDateClick) {
        // Use the sort function to create a new array of movies sorted by their release date in descending order
        sortedMovies = movies.sort(
            (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        sortByDateButton.textContent = "Sort by date (oldest to latest)";
        firstSortByDateClick = true;
    }
    renderMovies(sortedMovies);
}

// sort by date button element by its id
sortByDateButton.addEventListener("click", sortByDate);

let firstSortByRatingClick = true;
const sortByRatingButton = document.getElementById("sort-by-rating");
// Declare a function to sort the movies by rating
function sortByRating() {
    let sortedMovies; 
    if (firstSortByRatingClick) {
        // Use the sort function to create a new array of movies sorted by their vote average in descending order
        sortedMovies = movies.sort((a, b) => a.vote_average - b.vote_average);
        sortByRatingButton.textContent = "Sort by rating (most to least)";
        firstSortByRatingClick = false;
    } else if (!firstSortByRatingClick) {
        // Use the sort function to create a new array of movies sorted by their vote average in descending order
        sortedMovies = movies.sort((a, b) => b.vote_average - a.vote_average);
        sortByRatingButton.textContent = "Sort by rating (least to most)";
        firstSortByRatingClick = true;
    }
    renderMovies(sortedMovies);
}

// Get the sort by rating button element by its id
sortByRatingButton.addEventListener("click", sortByRating);

// pagination element with three buttons 
const pagination = document.querySelector("div.pagination"); 
const prevButton = document.querySelector("button#prev-button"); 
const pageNumberButton = document.querySelector("button#page-number-button"); 
const nextButton = document.querySelector("button#next-button"); 

// Add event listeners to the pagination buttons 
prevButton.addEventListener("click", () => { 
  // Decrease the current page by 1 
  if(currentPage > 1)
  currentPage--; 
  // Fetch the movies for the previous page 
  fetchMovies(currentPage); 
  // Update the page number button text 
  pageNumberButton.textContent = `Current Page: ${currentPage}`; 
  // Disable the previous button when the current page is 1 
  if (currentPage === 1) { 
    prevButton.disabled = true; 
    nextButton.disabled = false; 
  } else if (currentPage === 2) { 
    prevButton.disabled = false; 
    nextButton.disabled = false; 
  }
});

nextButton.addEventListener("click", () => { 
  // Increase the current page by 1 
  currentPage++; 
  // Fetch the movies for the previous page 
  fetchMovies(currentPage);
  // Update the page number button text 
  pageNumberButton.textContent = `Current Page: ${currentPage}`; 
  // Disable the next button when the current page is equal to the total number of pages or 3, whichever is smaller 
  if (currentPage === 3) { 
    prevButton.disabled = false; 
    nextButton.disabled = true; 
  } else if (currentPage === 2) { 
    prevButton.disabled = false; 
    nextButton.disabled = false; 
  }
});

const searchMovies = async (searchedMovie) => {
  try{
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${searchedMovie}&api_key=f531333d637d0c44abc85b3e74db2186&include_adult=false&language=en-US&page=1`
    );
    const result = await response.json();
    movies = result.results;
    renderMovies(movies);
    searchedMovie = true;
  } catch (error) {
    console.log(error);
  }
};

// Get the search button element by its id
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
searchButton.addEventListener("click", () => {
  searchMovies(searchInput.value);
  pagination.style.display = "none";
});

const getMovieByName = async (movieName) => {
  try { 
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=f531333d637d0c44abc85b3e74db2186&include_adult=false&language=en-US&page=1`
    );
    const result = await response.json();
    return result.results[0];
  } catch (error) {
    console.log(error);
  }
};

// Showing only the movies from the localStorage in Favorites Tab
const showFavourites = (favMoviesName) => {
  const { poster_path, title, vote_count, vote_average } = favMoviesName;
  let listItem = document.createElement("li");
  listItem.className = "card";
  let imgSrc = poster_path
    ? `https://image.tmdb.org/t/p/original/${poster_path}`
    : "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";
  listItem.innerHTML += `
    <img
      class="poster"
      src=${imgSrc}
      alt="${title}"
    />
    <p class="title">${title}</p>
    <section class="vote-favouriteIcon">
      <section class="vote">
        <p class="vote-count">Votes: ${vote_count}</p>
        <p class="vote-average">Rating: ${vote_average}</p>
      </section>
      <i class="favorite-icon fa-solid fa-xmark fa-xl xmark" id="${title}"></i>
    </section>`;
  
  const removeFromWishlistBtn = listItem.querySelector(".xmark");
  removeFromWishlistBtn.addEventListener("click", (event) => {
    const { id } = event.target;
    // Removing movie name from the localStorge
    removeMovieNameFromLocalStorage(id);
    fetchWishlistMovie();
  });
  moviesList.appendChild(listItem);
};

// Fetching each movie data from the localStorage
const fetchWishlistMovie = async () => {
  moviesList.innerHTML = "";
  const movieNamesList = getMovieNamesFromLocalStorage();
  for (let i = 0; i < movieNamesList.length; i++) {
    const movieName = movieNamesList[i];
    let movieDataFromName = await getMovieByName(movieName);
    showFavourites(movieDataFromName);
  }
};

const allTab = document.getElementById("all-tab");
const favoritesTab = document.getElementById("favorites-tab");
const sortBtns = document.querySelector(".sorting-options");
// Declare a function to display all movies or favorites movies based on the active tab
function displayMovies() {
  // Check which tab is active and call renderMovies function with appropriate argument
  if (allTab.classList.contains("active-tab")) {
    renderMovies(movies);
    sortBtns.style = "revert";
    pagination.style = "revert";
  } else if (favoritesTab.classList.contains("active-tab")) {
    fetchWishlistMovie();
    sortBtns.style.display = "none";
    pagination.style.display = "none";
  }
}

// Declare a function to switch between tabs
function switchTab(event) {
  // Remove the active-tab class from both tabs
  allTab.classList.remove("active-tab");
  favoritesTab.classList.remove("active-tab");

  // Add the active-tab class to the clicked tab
  event.target.classList.add("active-tab");

  // Call the displayMovies function to update the movies list
  displayMovies();
}

// Add event listeners to the tabs elements that call the switchTab function when clicked
allTab.addEventListener("click", switchTab);
favoritesTab.addEventListener("click", switchTab);
