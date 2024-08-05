import React from "react";

import back from "../assets/back.svg";
import user from "../assets/user.svg";
import planet from "../assets/planet.png";
import arrow from "../assets/arrow.png";

import "./ChatArea.css";

export default function ChatArea(props) {
  return (
    <div className="chat-area" >
      <div className="header">
        <img src={back} alt="back" id="back-button" onClick={props.toggle} />
        <div className="user">
          <img src={user} alt="user" />
          <p>{props.currentContact.name}</p>
        </div>
      </div>

      <div className="messages">
        <img src={planet} alt="" />
        <p>Site under construction....</p>
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
