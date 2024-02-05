
import { db } from "./configFirebase.js";
import {getWatchedMovies,getUnWatchedMovies} from "./index.js";



// här skapar vi elements/innehåll för en film
function createMovieElement(movie) {
    const containerElm = document.createElement("article");
    const headingElem = document.createElement("h3");
    const genreElem = document.createElement("p");
    const dateReleaseElm = document.createElement("p");
    const watchedButton = document.createElement("button");
    const removeButton = document.createElement("button");
    containerElm.classList.add("movie-item");
  
    removeButton.addEventListener("click", () => {
      const movieId = movie.id;
      deleteMovieButton(movieId);
    });
  
    headingElem.innerText = movie.title.title || "No Title";
    genreElem.innerText = movie.title.genre || "No Genre";
    dateReleaseElm.innerText = movie.title.releaseDate || "No Release-Date";
  
    watchedButton.innerText = movie.title.watched ? "SEEN!" : "WATCH?";
    removeButton.innerText = "DELETE";
  
    containerElm.append(headingElem);
  
    containerElm.append(genreElem);
    containerElm.append(dateReleaseElm);
    containerElm.append(watchedButton);
    containerElm.append(removeButton);
  
    watchedButton.addEventListener("click", async () => {
      try {
        const updatedMovie = { watched: !movie.title.watched };
        const movieRef = doc(db, "movies", movie.id);
        await updateDoc(movieRef, updatedMovie);
  
        watchedButton.innerText = updatedMovie.watched ? "SEEN!" : "WATCH?";
  
        alert(`Movie marked as ${updatedMovie.watched ? "SEEN!" : "WATCH?"}`);
      } catch (error) {
        console.error(`ERROR: UPDATE FAILED: ${error}`);
      }
    });
  
    const movieContentElm = document.querySelector("#allMoviesContent");
  
    if (movieContentElm) {
      movieContentElm.append(containerElm);
    } else {
      console.error("Movie list is empty");
    }
  }

  // Här loopar vi igenom film för film i vår film-lista och visar alla i webbläsaren
function displayAllMovies(myMovies) {
    const movieContentElm = document.querySelector("#allMoviesContent");
  
    movieContentElm.innerHTML = "";
  
    for (const movie of myMovies) {
      createMovieElement(movie);
    }
  }
  
  //här definerar vi en funktion för att kunna visa alla sedda filmer
let watchedMovies = [];
async function displayWatchedMovies() {
  try {
    const watchedMoviesContentElm = document.querySelector("#allMoviesContent");

    if (watchedMoviesContentElm) {
      watchedMoviesContentElm.innerHTML = "";

      const watchedMovies = await getWatchedMovies();
      for (const movie of watchedMovies) {
        createMovieElement(movie);
      }
    } else {
      console.error("The database is empty");
    }
  } catch (error) {
    console.error("ERROR:", error);
  }
}

//här definerar vi en funktion för att kunna visa alla osedda filmer
let unWhatchedMovies = [];
async function displayUnwhatchedMovies() {
  try {
    const unWhatchedMoviesContentElm =
      document.querySelector("#allMoviesContent");
    if (unWhatchedMoviesContentElm) {
      unWhatchedMoviesContentElm.innerHTML = "";

      const unWhatchedMovies = await getUnWatchedMovies();
      for (const movie of unWhatchedMovies) {
        createMovieElement(movie);
      }
    } else {
      console.log("The database is empty");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
}

  export {createMovieElement,displayAllMovies,displayWatchedMovies,displayUnwhatchedMovies};


