import React from "react";

export default function Message(props) {
  return (
    <div className="message ">
      <p>{props.message}</p>
      <span>{props.timestrap}</span>
    </div>
  );
}
