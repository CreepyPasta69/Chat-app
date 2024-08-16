import React, { useState } from "react";
import "./ContactMenu.css";

export default function ContactMenu(props) {
  const [search, setSearch] = useState("");

  const contacts = props.data
    .filter((item) => {
      return search.toLowerCase() === ""
        ? item.name
        : item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase());
    })
    .map((contact) => (
      <div
        key={contact.id}
        id={contact.id}
        className="contact"
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
        {contact.isActive && <div className="online"></div>}
      </div>
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
        <div className="indicator"></div>
        {contacts}
      </div>
    </div>
  );
}
