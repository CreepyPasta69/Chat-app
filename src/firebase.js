// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyAqQsIEdkLii1ZluhKkuV4jbpJZQTGkVRE",
  authDomain: "echo-chatapp-f183f.firebaseapp.com",
  projectId: "echo-chatapp-f183f",
  storageBucket: "echo-chatapp-f183f.appspot.com",
  messagingSenderId: "271982547419",
  appId: "1:271982547419:web:b2f1c75b5dd0201629d7fe",
  measurementId: "G-MSD8T8DSJW",
  databaseURL: "https://echo-chatapp-f183f-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rdb = getDatabase(app);
export const storage = getStorage(app, "gs://echo-chatapp-f183f.appspot.com")