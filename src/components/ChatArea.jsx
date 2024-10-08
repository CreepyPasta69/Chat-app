import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { v4 as uuid4v } from "uuid";
import EmojiPicker from "emoji-picker-react";

import back from "../assets/back.svg";

import "./ChatArea.css";

export default function ChatArea(props) {
  const [chat, setChat] = useState("");
  const [message, setMessage] = useState("");
  const [emojiPickerVisibility, setEmojiPickerVisibility] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (props.currentContact) {
      const contactId = props.currentContact.id;
      const currentChat = Object.values(props.chats).find((chat) =>
        chat.participants.includes(contactId)
      );
      setChat(currentChat);
    }
  }, [props.currentContact, props.chats]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  useEffect(() => {
    if (chat && chat.messages) {
      const unreadMessages = chat.messages.filter(
        (msg) => msg.sender !== props.uid && msg.read === false
      ).length;
      if (unreadMessages > 0) {
        updateUnreadMessages();
        console.log("Updated Messages");
      }
    }
  }, [chat, props.uid]);

  if (props.currentContact === null) {
    return <div className="chat-area-null">Hello User</div>;
  }

  const sendMessage = async () => {
    if (message.trim() !== "") {
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
    }
    setMessage("");
  };

  const handleEmoji = (e) =>{
    setMessage((prev)=>(prev + e.emoji))
    setEmojiPickerVisibility(false)
  }

  const updateUnreadMessages = async () => {
    const updatedMessages = chat.messages.map((msg) =>
      msg.sender !== props.uid && !msg.read ? { ...msg, read: true } : msg
    );
    const chatRef = doc(db, "chats", chat.cid);
    await updateDoc(chatRef, {
      messages: updatedMessages,
    });
  };

  function formatTime(data) {
    const date = data.toDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function formatDate(data) {
    const date = data.toDate();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const unreadMessages = chat.messages?.filter(
    (msg) => msg.sender !== props.uid && msg.read === false
  ).length;

  const messages = chat.messages?.map((msg, i) => {
    const messageClass = msg.sender === props.uid ? "sent" : "received";
    const isSameClassPrev =
      (i > 0 && chat.messages[i - 1].sender) === msg.sender;
    const isSameClassNext =
      (i < chat.messages.length - 1 && chat.messages[i + 1].sender) ===
      msg.sender;
    const isFirstInSequence = !isSameClassPrev && messageClass === "received";
    const showDate =
      i === 0 ||
      formatDate(chat.messages[i].timestrap) !==
        formatDate(chat.messages[i - 1].timestrap);
    const showUnread = isFirstInSequence && !msg.read;

    return (
      <React.Fragment key={msg.messageId}>
        {showDate && (
          <div className="date">
            <span>{formatDate(msg.timestrap)}</span>
          </div>
        )}
        {showUnread && (
          <div className="unread">
            <span>{`${unreadMessages} unreadMessages`}</span>
          </div>
        )}
        <div
          key={msg.messageId}
          className={`message ${messageClass} ${
            isSameClassNext ? "continued" : ""
          }`}
        >
          {isFirstInSequence && (
            <img
              src={props.currentContact.profile}
              alt={`${props.currentContact.name}'s avatar`}
              className="sender-image"
            />
          )}
          <p>{msg.text}</p>
          {msg.sender === props.uid &&
            (msg.read ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgba(255,255,255,1)"
              >
                <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgba(255,255,255,1)"
              >
                <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
              </svg>
            ))}
          <span>{formatTime(msg.timestrap)}</span>
        </div>
      </React.Fragment>
    );
  });

  return (
    <div className="chat-area">
      <div className="header">
        <img src={back} alt="back" id="back-button" />
        <p>{props.currentContact.name}</p>
      </div>

      <div className="messages">
        {messages}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          onClick={() => setEmojiPickerVisibility((prev) => !prev)}
        >
          <g fill="none" fill-rule="evenodd">
            <path
              d="M24 0v24H0V0h24ZM12.593 23.258l-0.011 0.002 -0.071 0.035 -0.02 0.004 -0.014 -0.004 -0.071 -0.035c-0.01 -0.004 -0.019 -0.001 -0.024 0.005l-0.004 0.01 -0.017 0.428 0.005 0.02 0.01 0.013 0.104 0.074 0.015 0.004 0.012 -0.004 0.104 -0.074 0.012 -0.016 0.004 -0.017 -0.017 -0.427c-0.002 -0.01 -0.009 -0.017 -0.017 -0.018Zm0.265 -0.113 -0.013 0.002 -0.185 0.093 -0.01 0.01 -0.003 0.011 0.018 0.43 0.005 0.012 0.008 0.007 0.201 0.093c0.012 0.004 0.023 0 0.029 -0.008l0.004 -0.014 -0.034 -0.614c-0.003 -0.012 -0.01 -0.02 -0.02 -0.022Zm-0.715 0.002a0.023 0.023 0 0 0 -0.027 0.006l-0.006 0.014 -0.034 0.614c0 0.012 0.007 0.02 0.017 0.024l0.015 -0.002 0.201 -0.093 0.01 -0.008 0.004 -0.011 0.017 -0.43 -0.003 -0.012 -0.01 -0.01 -0.184 -0.092Z"
              stroke-width="1"
            ></path>
            <path
              fill="currentColor"
              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10S2 17.523 2 12 6.477 2 12 2Zm2.8 11.857A3.984 3.984 0 0 1 12 15a3.984 3.984 0 0 1 -2.8 -1.143 1 1 0 1 0 -1.4 1.428A5.984 5.984 0 0 0 12 17a5.984 5.984 0 0 0 4.2 -1.715 1 1 0 0 0 -1.4 -1.428ZM8.5 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0 -3Zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0 -3Z"
              stroke-width="1"
            ></path>
          </g>
        </svg>

        <div className="emoji-picker">
          <EmojiPicker open={emojiPickerVisibility} onEmojiClick={handleEmoji}/>
        </div>

        <input
          type="text"
          placeholder="message.."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button onClick={sendMessage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,1)"
          >
            <path d="M3 12.9999H9V10.9999H3V1.84558C3 1.56944 3.22386 1.34558 3.5 1.34558C3.58425 1.34558 3.66714 1.36687 3.74096 1.40747L22.2034 11.5618C22.4454 11.6949 22.5337 11.9989 22.4006 12.2409C22.3549 12.324 22.2865 12.3924 22.2034 12.4381L3.74096 22.5924C3.499 22.7255 3.19497 22.6372 3.06189 22.3953C3.02129 22.3214 3 22.2386 3 22.1543V12.9999Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
