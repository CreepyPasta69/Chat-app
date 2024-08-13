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
      <h1>Chats</h1>
      <div className="header">
        
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search !== "" && <button onClick={()=>{setSearch("")}}>x</button>}
        </div>
        <button>+</button>
      </div>
      <div className="contacts">{contacts}</div>
    </div>
  );
}
