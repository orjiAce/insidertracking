// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBj6CzfePGfMwK5yWmoM-CpRQAJ5WwWxkQ",
    authDomain: "insider-tracking.firebaseapp.com",
    projectId: "insider-tracking",
    storageBucket: "insider-tracking.appspot.com",
    messagingSenderId: "105454301094",
    appId: "1:105454301094:web:4781bb246fb585c969e967",
    measurementId: "G-Z21759LPHW"
};


// Initialize Firebase

   const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });


