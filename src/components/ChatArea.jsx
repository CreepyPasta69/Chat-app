import React from "react";

import back from "../assets/back.svg"
import profile from "../assets/profile.png"
import arrow from "../assets/arrow.png"

import "./ChatArea.css";

export default function ChatArea(props) {
  return (
    <div className="chat-area" style={props.state ? {display: "none"} : {display: "flex"}}>
      <div className="header">
        <img src={back} alt="back" id="back-button" onClick={props.toggle} />
        <div className="user">
          <img src={profile} alt="user" />
          <p>username</p>
        </div>
      </div>
      <div className="message-input">
        <input type="text" placeholder="message.." />
        <button>
          <img src={arrow} alt="" />
        </button>
      </div>
    </div>
  );
}
