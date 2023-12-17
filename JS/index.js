import { db } from "./configFirebase.js";
import {
  addDoc,
  collection,
  getDocs,
  where,
  query,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function postMovie(movie) {
  try {
    // här kontrollera vi om en film med samma namn redan finns i databasen
    const existingMovies = await getAMovie(movie.title.toLowerCase());
    if (existingMovies.length > 0) {
      alert(`This movie "${movie.title}" already exists.`);
      return;
    }

    // Ifall filmen inte finns vill vi  att det ska gå att lägga till den i databasen med stora och små bokstäver
    // här skapar vi ett nytt egenskap som ärver alla egenskaper från movie object med en ny egenskap "titeleLowerCase"
    //för att ifall användare råkar skriva med stora bokstäver så ska det konverteras till smått i databasen
    //med  "titleLowerCase"
    const lowercaseTitle = movie.title.toLowerCase(); // här konverterar och förvarar vi varje film object i småbokstäver
    await addDoc(collection(db, "movies"), {
      ...movie,
      titleLowerCase: lowercaseTitle,
    });
    alert("Posted successfully");

    //här vill vi att våra inputs fält töms efter att vi skickat in data till firestore
    document.querySelector("#inputTitle").value = "";
    document.querySelector("#inputGenre").value = "";
    document.querySelector("#inputReleaseDate").value = "";

    // efter att vi lagt till filmen vill vi att vår firestore databas uppdetaeras med den nya filmen
    const allMovies = await getAllMovies();
    // displayAllMovies(allMovies);
  } catch (error) {
    console.log(`ERROR: unsuccessful ${error}`);
  }
}

async function getAMovie(title) {
  try {
    if (title !== "") {
      const titleToLowerCase = title.toLowerCase();
      const queryMovie = query(
        collection(db, "movies"),
        where("titleLowerCase", "==", titleToLowerCase)
      );
      const movies = await getDocs(queryMovie);

      const movieList = [];
      movies.forEach((movie) => {
        const m = {
          id: movie.id,
          title: movie.data(),
        };

        movieList.push(m);
      });
      return movieList;
    } else {
      // här vill vi att programmet kallar på "getAllMovies " om vi inte har någon film att hämta
      return await getAllMovies();
    }
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
}

async function update(id) {
  try {
    const movieRef = doc(db, "movies", id);
    const movieDoc = await getDoc(movieRef);

    if (movieDoc.exists()) {
      const watchedStatus = movieDoc.data().watched;
      const updatedMovie = { watched: !watchedStatus };

      await updateDoc(movieRef, updatedMovie);
      alert(`UPDATE SUCCESSFUL!`);
    } else {
      alert(`Movie not found.`);
    }
  } catch (error) {
    alert(`ERROR: UPDATE FAILED!`);
  }
}

async function deleteMovieButton(id) {
  try {
    await deleteDoc(doc(db, "movies", id));
    alert("Deleted successfully");

    // här hämtar vi alla filmer igen efter att vi gjort en delete-movie
    const allMovies = await getAllMovies();

    // uppdatera vår displayAllMovies
    displayAllMovies(allMovies);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
}

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

//här har vi skapat en Function för att hämta alla filmer
async function getAllMovies() {
  try {
    const querySnapshot = await getDocs(collection(db, "movies"));
    const allMovies = [];

    querySnapshot.forEach((movieDoc) => {
      const movie = {
        id: movieDoc.id,
        title: movieDoc.data(),
      };

      allMovies.push(movie);
    });

    return allMovies;
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
}

const getAllMoviesButton = document.querySelector("#get-all-movies-button");
//Här sätter vi en event-listener som visar alla filmer som finns i databasen
getAllMoviesButton.addEventListener("click", async () => {
  try {
    const allMovies = await getAllMovies();
    displayAllMovies(allMovies);
  } catch (error) {
    console.error("ERROR:", error);
  }
});

const addButtonElm = document.querySelector("#addMoviebutten");
const showWatchedListButton = document.querySelector("#showWatchedListButton");
const showUnwatchedListButton = document.querySelector(
  "#showUnwatchedListButton"
);

// här definerar vi en funktion för att hämta alla filmer som har blivit sedda
async function getWatchedMovies() {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "movies"), where("watched", "==", true))
    );
    const watchedMovies = [];

    querySnapshot.forEach((movieDoc) => {
      const movie = {
        id: movieDoc.id,
        title: movieDoc.data(),
      };

      watchedMovies.push(movie);
    });
    return watchedMovies;
  } catch (error) {
    console.error("Error fetching watched movies:", error);
    throw error;
  }
}

// här definerar vi en funktion för att hämta alla osedda filmer från vår databas
async function getUnWatchedMovies() {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "movies"), where("watched", "==", false))
    );
    const unWatchedMovies = [];

    querySnapshot.forEach((movieDoc) => {
      const movie = {
        id: movieDoc.id,
        title: movieDoc.data(),
      };

      unWatchedMovies.push(movie);
    });
    return unWatchedMovies;
  } catch (error) {
    console.error("Error fetching un watched movies:", error);
    throw error;
  }
}

showWatchedListButton.addEventListener("click", async () => {
  try {
    const watchedMovies = await getWatchedMovies();
    displayWatchedMovies(watchedMovies);
  } catch (error) {
    console.error("Error:", error);
  }
});

showUnwatchedListButton.addEventListener("click", async () => {
  try {
    const unWhatchedMovies = await getUnWatchedMovies();
    displayUnwhatchedMovies(unWhatchedMovies);
  } catch (error) {
    console.error("ERROR:", error);
  }
});

addButtonElm.addEventListener("click", () => {
  const movie = {
    title: document.querySelector("#inputTitle").value,
    genre: document.querySelector("#inputGenre").value,
    releaseDate: document.querySelector("#inputReleaseDate").value,
    watched: false,
  };
  postMovie(movie);
});

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

//här skapar vi en listener på vår search knapp för när vi klickar på det så ska den vår sökta film hämtas från databasen
const searchButton = document.querySelector("#searchButton");
searchButton.addEventListener("click", async () => {
  const searchInput = document.querySelector("#searchInput").value.trim();

  // här kontrollerar vi att inputsfältet inte är tomt när vi klickar på knappen
  if (searchInput !== "") {
    try {
      // här kallar vi på vår getAmovie funktion för att hämta vår sökta film
      const searchedMovies = await getAMovie(searchInput);

      // här vill vi med hjälp av displaySearchResults visa sökta filmen i webbläsaren
      displaySearchResults(searchedMovies);

      document.querySelector("#searchInput").value = "";
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    alert("Please insert a movie title before clicking the button!");
  }
});

// här skapar vi en funktion som sköter visandet av sökta filmer
function displaySearchResults(searchResults) {
  const movieContentElm = document.querySelector("#allMoviesContent");

  movieContentElm.innerHTML = "";

  if (searchResults.length === 0) {
    // visa meddelande att det finns ingen sådan film i databasen
    alert("There is no movie with this title in the database.");
  } else {
    //loopar igenom alla filmer efter en matchning med vår sökta film namn
    for (const movie of searchResults) {
      createMovieElement(movie);
    }
  }
}
