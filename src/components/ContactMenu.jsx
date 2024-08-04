import React from "react";
import Contact from "./Contact";
import "./ContactMenu.css";

export default function ContactMenu(props) {
  return (
    <div className="contact-menu" style={props.state ? {display: "block"} : {display: "none"}}>
      <div className="header">
        <h1>Chats</h1>
        <input type="text" placeholder="Search..." />
      </div>
      <div className="contacts" onClick={props.toggle}>
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
      </div>
    </div>
  );
}
