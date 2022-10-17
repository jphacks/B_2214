import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC--xNWLI6XfD3MfeeuNP74OrqkfKbgL-w",
    authDomain: "oyster-365512.firebaseapp.com",
    projectId: "oyster-365512",
    storageBucket: "oyster-365512.appspot.com",
    messagingSenderId: "390280072766",
    appId: "1:390280072766:web:a90931d7a1fb2541190b6f",
    measurementId: "G-5S4MHWZBH1"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
export const STATE_CHANGED = 'state_changed';

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
