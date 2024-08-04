import React from "react";
import { auth } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import SideBar from "./SideBar";
import Login from "./Login.jsx";
import ChatBox from "./ChatBox";

import "./App.css";

export default function App() {
  const [user] = useAuthState(auth);

  const googleSignin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOut = () => {
    auth.signOut();
  };

  return (
    <>
      {!user ? (
        <Login login={googleSignin} />
      ) : (
        <div className="app">
          <SideBar logout={signOut}/>
          <ChatBox />
        </div>
      )}
    </>
  );
}
