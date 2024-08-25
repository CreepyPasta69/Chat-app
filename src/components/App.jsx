import React, { useState, useEffect } from "react";
import { auth, db, rdb } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { ref, set, onDisconnect, update } from "firebase/database";

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

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const unsub = onSnapshot(
        userDocRef,
        async (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
          } else {
            const newUserData = {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              createdAt: new Date(),
              friends: [],
              friendRequests: {
                sent: [],
                received: [],
              },
            };

            try {
              await setDoc(userDocRef, newUserData);
              setUserData(newUserDoc.data());
            } catch (error) {
              console.log("Error creating user document: ", error);
            }
          }
        },
        (error) => {
          console.log("Error fetching user data: ", error);
        }
      );

      const userStatusRef = ref(rdb, `/users/${user.uid}`);

      set(userStatusRef, {
        isActive: true,
      });

      onDisconnect(userStatusRef).update({
        isActive: false,
      });

      return () => {
        unsub();
        set(userStatusRef, null);
      };
    }
  }, [user]);

  const googleSignin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log("Error while signing in: ", error);
    }
  };

  const signOut = async () => {
    const userStatusRef = ref(rdb, `/users/${user.uid}`);
    await update(userStatusRef, {
      isActive: false,
    });

    await auth.signOut();

    setUserData(null);
  };

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
          {activeMenu === "Chat" && <ChatBox uid={userData.uid} />}
          {activeMenu === "Profile" && (
            <Profile userData={userData} setUserData={setUserData} />
          )}
        </div>
      )}
    </>
  );
}
