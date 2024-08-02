import React from "react";
import "./SideBar.css";

export default function SideBar() {
  return (
    <div className="sidebar">
        <div className="hero">
            <img src="src\assets\echo.png" alt="logo" onClick={()=> console.log("i feel molested")}/>
        </div>
        <div className="menu">
            <img src="src\assets\home.png" alt="home" />
            <img src="src\assets\chat.png" alt="chat" />
            <img src="src\assets\star.png" alt="star" />
        </div>
        <div className="profile">
            <img src="src\assets\profile.png" alt="" />
        </div>
    </div>
  );
}
