import React from "react";

import "./Message.css"

export default function Message(props) {
  return (
    <div className="message ">
      <p>{props.message}</p>
      <span>{props.timestrap}</span>
    </div>
  );
}
