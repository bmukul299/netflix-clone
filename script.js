const apiKey = "61bb922704381e492d672f7c99f6ad80";
const apiEndPoint = "https://api.themoviedb.org/3";
const imagePath = "https://image.tmdb.org/t/p/original";
const youtubeApiKey = "AIzaSyC-R4S0eOvlPgnG3BIcX8BaQCqEPLXa1tk"

const apiPaths = {
  fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
  fetchMovieList: (id) =>
    `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
  fetchTrending: `${apiEndPoint}/trending/all/day?api_key=${apiKey}`,
  searchOnYoutube : (query)=>`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeApiKey}`
};

const init = () => {
  fetchAndBuildAllSection();
  fetchTrendingMovie()
};

const fetchTrendingMovie = ()=>{
  fetchAndBuildMovieSection(apiPaths.fetchTrending,"Trending Now")
  .then(list =>{
    buildBannerSection(list[Math.floor(Math.random()* list.length)])
  }).catch(err=>console.error(err))
}

const buildBannerSection  = (movie)=>{
  const bannerContainer = document.querySelector(".banner_section")
  bannerContainer.style.backgroundImage = `url("${imagePath}${movie.backdrop_path}")`

  const div = document.createElement("div")
  div.className = "banner_content container"

  div.innerHTML = `
  <h2 class="banner_heading">${movie.title}</h2>
  <p class="banner_info">Trending in movies | Released date - ${movie.release_date}</p>
  <p class="banner_overview">
    ${movie.overview}
  </p>
  <div class="banner_button-container">
    <button class="banner_button"><span><i class="fa-solid fa-play"></i></span>&nbsp;   Play</button>
    <button class="banner_button"><span><i class="fa-sharp fa-solid fa-circle-exclamation"></i></span> &nbsp;&nbsp;More info</button>
    </div>
  `

  bannerContainer.append(div)
}
const fetchAndBuildAllSection = () => {
  fetch(apiPaths.fetchAllCategories)
    .then((response) => response.json())
    .then((response) => {
      const categories = response.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.map((category) =>
          fetchAndBuildMovieSection(
            apiPaths.fetchMovieList(category.id),
            category.name
          )
        );
      }
    })
    .catch((err) => console.error(err));
};

const fetchAndBuildMovieSection = (fetchUrl, categoryName) => {
   return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMovieSection(movies, categoryName);
      }
      return movies
    })
    .catch((err) => console.error(err));
};

const buildMovieSection = (list, categoryName) => {
  const moviesContainer = document.querySelector(".movies_container");
  const movieListHtml = list
    .map((item) => {
      return `
    <img src="${imagePath}${item.backdrop_path}" alt="${item.title}" onClick = "fetchYoutubeTrailer('${item.title}')"/>
        `
    })
    .join("");

  const movieSectionHtml = `
            <h2>${categoryName} <span class="explore">Explore now</span></h2>
         <div class="movies_row">
          ${movieListHtml}
        </div> `;

  const div = document.createElement("div");
  div.className = "movies_section";
  div.innerHTML = movieSectionHtml;

  moviesContainer.append(div);
};


const fetchYoutubeTrailer = (movieName)=>{
      if(!movieName) return

      fetch(apiPaths.searchOnYoutube(movieName))
      .then(res=>res.json())
      .then(res=>{
        const youtubeTrailer = `https://www.youtube.com/watch?v=${res.items[0].id.videoId}`
        window.open(youtubeTrailer,"_blank")
      }
        )
      .catch(err=>console.error(err))
}
window.addEventListener("load", () => {
  init();
  window.addEventListener("scroll",()=>{
    const navbar = document.querySelector("#navbar")
  
    if(window.scrollY > 5){
      navbar.classList.add("bg_color")
    }else{
      navbar.classList.remove("bg_color")
    }
  
  })
});






