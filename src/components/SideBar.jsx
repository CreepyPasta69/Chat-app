import React, { useState } from "react";

import logo from "/src/assets/logo.png";
import home from "../assets/home.svg";
import chat from "../assets/chat-white.svg";
import star from "../assets/star.svg";
import indicator from "../assets/indicator.svg";
import logout from "../assets/logout.svg";

import "./SideBar.css";

export default function SideBar(props) {
  return (
    <div className="sidebar">
      <div className="hero">
        <img
          src={logo}
          alt="logo"
          onClick={() => console.log("i feel molested")}
        />
      </div>
      <div className="menu">
        <img src={home} alt="home" />
        <img src={chat} alt="chat" style={{ zIndex: 10 }} />
        <img src={star} alt="star" />
        <img src={indicator} alt="" id="indicator" />
      </div>
      <div className="logout">
        <img src={logout} alt="logout" onClick={props.logout} />
      </div>
    </div>
  );
}
