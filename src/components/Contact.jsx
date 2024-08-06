import React from "react";
import user from "../assets/user.svg";
import "./Contact.css";

export default function Contact(props) {
  return (
    <div id={props.id} className="contact" onClick={props.setCurrentContact}>
      <img src={user} alt="" />
      <p>{props.name}</p>
    </div>
  );
}