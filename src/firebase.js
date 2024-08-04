// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyAqQsIEdkLii1ZluhKkuV4jbpJZQTGkVRE",
  authDomain: "echo-chatapp-f183f.firebaseapp.com",
  projectId: "echo-chatapp-f183f",
  storageBucket: "echo-chatapp-f183f.appspot.com",
  messagingSenderId: "271982547419",
  appId: "1:271982547419:web:b2f1c75b5dd0201629d7fe",
  measurementId: "G-MSD8T8DSJW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);