import React, { useState } from "react";

import Message from "./Message";

import back from "../assets/back.svg";
import user from "../assets/user.svg";
import arrow from "../assets/arrow.png";

import "./ChatArea.css";

export default function ChatArea(props) {
  const [chat, setChat] = useState("");

  const sendMessage = () => {
    console.log("Message : ", chat);
    setChat("");
  };

  if (props.currentContact === null){
    return(<div className="chat-area">Hello User</div>)
  }

  return (
    <div className="chat-area">
      <div className="header">
        <img src={back} alt="back" id="back-button"/>
        <div className="user">
          <img src={user} alt="user" />
          <p>{props.currentContact.name}</p>
        </div>
      </div>

      <div className="messages">
        <div className="message sent">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
            placeat sit doloremque nostrum quo, quis impedit, totam dolorum
            adipisci deleniti illum itaque minus ad labore autem assumenda
            exercitationem sapiente enim.
          </p>
          <span>19:19</span>
        </div>
        <div className="message recieved">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae
            reiciendis ab iure perspiciatis. Officiis labore iste voluptates
            autem dicta eum hic voluptatibus, deserunt quo quasi soluta
            excepturi necessitatibus itaque rem?
          </p>
          <span>19:19</span>
        </div>
        <div className="message sent">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
            placeat sit 
          </p>
          <span>19:19</span>
        </div>
        <div className="message sent">
          <p>
            L autem assumenda
            exercitationem sapiente enim.
          </p>
          <span>19:19</span>
        </div>
      </div>

      <div className="message-input">
        <input
          type="text"
          placeholder="message.."
          value={chat}
          onChange={(e) => {
            setChat(e.target.value);
          }}
        />
        <button onClick={sendMessage}>
          <img src={arrow} alt="" />
        </button>
      </div>
    </div>
  );
}
