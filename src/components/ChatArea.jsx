import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { v4 as uuid4v } from "uuid";

import back from "../assets/back.svg";
import user from "../assets/user.svg";
import arrow from "../assets/arrow.png";

import "./ChatArea.css";

export default function ChatArea(props) {
  const [chat, setChat] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (props.currentContact) {
      const contactId = props.currentContact.id;
      const currentChat = Object.values(props.chats).find((chat) =>
        chat.participants.includes(contactId)
      );
      setChat(currentChat);
    }
  }, [props.currentContact, props.chats]);

  if (props.currentContact === null) {
    return <div className="chat-area">Hello User</div>;
  }

  const sendMessage = async () => {
    console.log("Message : ", message);
    const chatRef = doc(db, "chats", chat.cid);
    const msgId = uuid4v();

    await updateDoc(chatRef, {
      messages: arrayUnion({
        messageId: msgId,
        sender: props.uid,
        text: message,
        timestrap: new Date(),
        read: false,
      }),
      lastMessage: {
        sender: props.uid,
        text: message,
        timestrap: new Date(),
        read: false,
      },
      updatedAt: new Date(),
    });
    setMessage("");
  };

  function formatTime(data) {
    const date = data.toDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const messages = chat.messages?.map((msg, i) => {
    const messageClass = msg.sender === props.uid ? "sent" : "recieved";
    const isSameClass = (i > 0 && chat.messages[i - 1].sender) === msg.sender;
    const isFirstInSequence =
      !isSameClass && messageClass === "received";

    return (
      <div
        key={msg.messageId}
        className={`message ${messageClass} ${
          isSameClass ? "continued" : ""
        }`}
      >
        {isFirstInSequence && (
          <img
            src={props.currentContact.profileURL}
            alt={`${props.currentContact.displayName}'s avatar`}
            className="sender-image"
          />
        )}
        <p>{msg.text}</p>
        <span>{formatTime(msg.timestrap)}</span>
      </div>
    );
  });

  return (
    <div className="chat-area">
      <div className="header">
        <img src={back} alt="back" id="back-button" />
        <div className="user">
          <img src={user} alt="user" />
          <p>{props.currentContact.name}</p>
        </div>
      </div>

      <div className="messages">{messages}</div>

      <div className="message-input">
        <input
          type="text"
          placeholder="message.."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button onClick={sendMessage}>
          <img src={arrow} alt="" />
        </button>
      </div>
    </div>
  );
}
