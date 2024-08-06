import React, { useState } from "react";
import { auth } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import SideBar from "./SideBar";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import ChatBox from "./ChatBox";
import Friends from "./Friends.jsx";

import "./App.css";

export default function App() {
  const [user] = useAuthState(auth);
  const [activeMenu, setActiveMenu] = useState("Home")

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
          <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} logout={signOut}/>
          {activeMenu === "Home" && <Home/>}
          {activeMenu === "Chat" && <ChatBox />}
          {activeMenu === "Friends" && <Friends />}
        </div>
      )}
    </>
  );
}
