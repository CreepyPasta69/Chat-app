import React, { useEffect, useState } from "react";
import {rdb} from "../firebase.js"
import { ref, onValue} from "firebase/database";
import "./ContactMenu.css";

export default function ContactMenu(props) {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState({})

  useEffect(()=>{
    const userRef = ref(rdb, "/users");

    const unsub = onValue(userRef, (snapshot)=>{
      const status = snapshot.val()
      setActiveStatus(status);
    })

    return() => unsub()
  },[])

  const contacts = props.data
    .filter((item) => {
      return search.toLowerCase() === ""
        ? item.name
        : item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase());
    })
    .map((contact) => (
      <React.Fragment key={contact.id}>
      <div
        key={contact.id}
        id={contact.id}
        className={`contact ${(props.currentContact?.id===contact.id) ? `active` : ``}`}
        onClick={() => {
          props.setCurrentContact(contact);
        }}
      >
        <img src={contact.profile} alt="" />
        <div className="details">
          <p className="name">{contact.name}</p>
          <p className="last-message">{contact.lastMessage}</p>
        </div>
        {(contact.unreadMessages > 0) && <div className="unread">{contact.unreadMessages}</div>}
        {activeStatus[contact.id]?.isActive && <div className="online"></div>}
      </div>
      <div className="hr"></div>
      </React.Fragment>
    ));

  return (
    <div className="contact-menu">
      <h1>Chats</h1>
      <div className="header">
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search !== "" && (
            <button
              onClick={() => {
                setSearch("");
              }}
            >
              x
            </button>
          )}
        </div>
        <button>+</button>
      </div>
      <div className="contacts">
        {contacts}
      </div>
    </div>
  );
}
