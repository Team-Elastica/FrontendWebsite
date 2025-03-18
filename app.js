// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAAA3Dlkw_FgfFY8Tt4t52higLegrXUhg",
    authDomain: "fmdb-5914.firebaseapp.com",
    projectId: "fmdb-5914",
    storageBucket: "fmdb-5914.firebasestorage.app",
    messagingSenderId: "85622286775",
    appId: "1:85622286775:web:52b6b2436f46645c7ce032",
    measurementId: "G-4D49MP4K18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait for the page to fully load before adding event listeners
document.addEventListener("DOMContentLoaded", function () {
    // Login function
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    
                    console.log("User logged in:", userCredential.user);
                })
                .catch((error) => {
                    document.getElementById("message").innerText = "Error: " + error.message;
                    console.error(error);
                });
        });
    }

    // Signup function
    const signupBtn = document.getElementById("signupBtn");
    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                document.getElementById("signupMessage").innerText = "Passwords do not match!";
                return;
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    document.getElementById("signupMessage").innerText = "Account created successfully!";
                    console.log("User created:", userCredential.user);
                })
                .catch((error) => {
                    document.getElementById("signupMessage").innerText = "Error: " + error.message;
                    console.error(error);
                });
        });
    }
});

// Check if the user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user);
        document.getElementById("message").innerText = "Welcome " + user.email;
    } else {
        console.log("No user is logged in.");
    }
});