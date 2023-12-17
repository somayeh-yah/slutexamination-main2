

  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {

    apiKey: "AIzaSyBj4tuls9jM3Ib3QgMokCpA-dxavF7Gh6c",

    authDomain: "webbkommunikation-de-ve-de.firebaseapp.com",

    projectId: "webbkommunikation-de-ve-de",

    storageBucket: "webbkommunikation-de-ve-de.appspot.com",

    messagingSenderId: "595541168418",

    appId: "1:595541168418:web:1defa4121f38c3cc91557b"

  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  export {db}
