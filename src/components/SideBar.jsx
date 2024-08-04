import React, {useState} from "react";

import "./SideBar.css";

export default function SideBar(props) {
  return (
    <div className="sidebar">
        <div className="hero">
            <img src="src\assets\logo.png" alt="logo" onClick={()=> console.log("i feel molested")}/>
        </div>
        <div className="menu">
            <img src="src\assets\home.svg" alt="home" />
            <img src="src\assets\chat-white.svg" alt="chat" style={{zIndex: 10}}/>
            <img src="src\assets\star.svg" alt="star" />
            <img src="src\assets\indicator.svg" alt="" id="indicator" />
        </div>
        <div className="logout">
            <img src="src\assets\logout.svg" alt="logout" onClick={props.logout} />
        </div>
    </div>
  );
}
