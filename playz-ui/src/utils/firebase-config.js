// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-HK80nP_IV-B59S9fuKGa3lzX9gvD-W8",
  authDomain: "demonetflix-b048e.firebaseapp.com",
  projectId: "demonetflix-b048e",
  storageBucket: "demonetflix-b048e.firebasestorage.app",
  messagingSenderId: "841758499663",
  appId: "1:841758499663:web:e8d9a135b1e2618da75b3a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);