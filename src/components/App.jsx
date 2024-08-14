import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import SideBar from "./SideBar";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import ChatBox from "./ChatBox";
import Profile from "./Profile.jsx";

import "./App.css";

export default function App() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [activeMenu, setActiveMenu] = useState("Home");

  const googleSignin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date(),
            friends: [],
            friendRequests: {
              sent: [],
              recieved: [],
            },
          });
        }
        const newUserDoc = await getDoc(userDocRef);
        setUserData(newUserDoc.data());
      }
    } catch (error) {
      console.log("Error while signing in: ", error);
    }
  };

  const signOut = async () => {
    await auth.signOut();
    setUserData(null);
  };

  useEffect(() => {
    if (user && !userData) {
      async function fetchUserData() {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("File does not exist");
          }
        } catch(error) {
          console.log("Error fetching user data: ", error);
        }
      }
      fetchUserData();
    }
  }, [user, userData]);

  return (
    <>
      {!user ? (
        <Login login={googleSignin} />
      ) : (
        <div className="app">
          <SideBar
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            logout={signOut}
          />
          {activeMenu === "Home" && userData && (
            <Home uid={userData.uid} displayName={userData.displayName} />
          )}
          {activeMenu === "Chat" && <ChatBox uid={userData.uid}/>}
          {activeMenu === "Profile" && <Profile userData={userData} />}
        </div>
      )}
    </>
  );
}
