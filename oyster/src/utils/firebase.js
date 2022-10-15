import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCpCMlQH0Eed14GrdpZHxPnlZ_Q11BqCcE",
    authDomain: "oyster-c2f6f.firebaseapp.com",
    projectId: "oyster-c2f6f",
    storageBucket: "oyster-c2f6f.appspot.com",
    messagingSenderId: "233365225738",
    appId: "1:233365225738:web:20122899b2b0a7dd3f3af3",
    measurementId: "G-BBZB59C2Y6"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
export const STATE_CHANGED = 'state_changed';
