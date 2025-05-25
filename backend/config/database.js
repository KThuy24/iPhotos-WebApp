import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJZKQUot6erGdrdkt2BDN9ACY9BpXvsG4",
  authDomain: "app--photos.firebaseapp.com",
  projectId: "app--photos",
  storageBucket: "app--photos.firebasestorage.app",
  messagingSenderId: "715459556397",
  appId: "1:715459556397:web:eb7230e0ee22975b56f4a4",
  measurementId: "G-4E1RLJ8812"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);