import React from "react";

import "./ChatArea.css";

export default function ChatArea(props) {
  return (
    <div className="chat-area" style={props.state ? {display: "none"} : {display: "flex"}}>
      <div className="header">
        <img src="src/assets/back.svg" alt="back" id="back-button" onClick={props.toggle} />
        <div className="user">
          <img src="src/assets/profile.png" alt="user" />
          <p>username</p>
        </div>
      </div>
      <div className="message-input">
        <input type="text" placeholder="message.." />
        <button>
          <img src="src/assets/arrow.png" alt="" />
        </button>
      </div>
    </div>
  );
}
