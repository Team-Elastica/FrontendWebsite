// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAAAA3Dlkw_FgfFY8Tt4t52higLegrXUhg",
  authDomain: "fmdb-5914.firebaseapp.com",
  projectId: "fmdb-5914",
  storageBucket: "fmdb-5914.appspot.com",
  messagingSenderId: "85622286775",
  appId: "1:85622286775:web:52b6b2436f46645c7ce032",
  measurementId: "G-4D49MP4K18",

  databaseURL: "https://fmdb-5914-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };

