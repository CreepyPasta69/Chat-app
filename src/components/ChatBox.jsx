import React from "react";
import "./ChatBox.css";

export default function ChatBox() {
  return (
    <div className="chatbox">
      <div className="contacts"></div>
      <div className="chat">
        <div className="header">
          <div className="user">
            <img src="src/assets/profile.png" alt="user" />
            <p>username</p>
          </div>
          <img src="src/assets/star.png" alt="favorite" />
        </div>
        <div className="message-input">
          <input type="text" placeholder="message.."/>
          <button><img src="src/assets/arrow.png" alt="" /></button>
        </div>
      </div>
    </div>
  );
}
