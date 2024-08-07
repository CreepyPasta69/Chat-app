import React, { useState } from "react";
import Contact from "./Contact";
import "./ContactMenu.css";

export default function ContactMenu(props) {
  const [search, setSearch] = useState("");
  console.log(search);

  const contacts = props.data
    .filter((item) => {
      return search.toLowerCase() === ""
        ? item.name
        : item.name.toLowerCase().includes(search.toLowerCase());
    })
    .map((contact) => (
      <Contact
        key={contact.id}
        id={contact.id}
        name={contact.name}
        setCurrentContact={() => {
          props.setCurrentContact(contact);
        }}
      />
    ));

  return (
    <div className="contact-menu">
      <div className="header">
        <h1>Chats</h1>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="contacts">{contacts}</div>
    </div>
  );
}
