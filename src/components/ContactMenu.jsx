import React from "react";
import Contact from "./Contact";
import "./ContactMenu.css";

export default function ContactMenu(props) {
  const contacts = props.data.map((contact) => (
    <Contact
      key={contact.id}
      id={contact.id}
      name={contact.name}
      setCurrentContact={() => {
        props.setCurrentContact(contact)
      }}
    />
  ));

  return (
    <div
      className="contact-menu"
      style={
        props.state || window.innerWidth > 850
          ? { display: "block" }
          : { display: "none" }
      }
    >
      <div className="header">
        <h1>Chats</h1>
        <input type="text" placeholder="Search..." />
      </div>
      <div className="contacts">{contacts}</div>
    </div>
  );
}
