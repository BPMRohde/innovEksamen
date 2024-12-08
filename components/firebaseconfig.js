// Importerer funktioner til at initialisere Firebase og få Firestore-databasen.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase konfiguration, der indeholder nøgler til projektet.
const firebaseConfig = {
  apiKey: "AIzaSyDcOzVB8EXfwDtLlnN5p4bKcscC_ZOOLgE",
  authDomain: "fir-test-b3f66.firebaseapp.com",
  databaseURL: "https://fir-test-b3f66-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-test-b3f66",
  storageBucket: "fir-test-b3f66.appspot.com",
  messagingSenderId: "896839969752",
  appId: "1:896839969752:web:e655fe02166110def720ad",
  measurementId: "G-ELVNEG5Y1L"
};

// Initialiserer Firebase og Firestore.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };