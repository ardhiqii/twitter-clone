import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyBv2evWjfi-VWFSF2X_44hWg3TNO1Skrco",
  authDomain: "twitter-clone-aufa.firebaseapp.com",
  projectId: "twitter-clone-aufa",
  storageBucket: "twitter-clone-aufa.appspot.com",
  messagingSenderId: "23169228105",
  appId: "1:23169228105:web:ff761e14a205209c0dce98"
};

export const firebaseApp = initializeApp(firebaseConfig)
