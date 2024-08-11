import React from "react";

import "./Request.css";

export default function Request(props) {
  return (
    <div className="request">
      <div className="user">
        <img src={props.profile} alt="" />
        <div className="details">
          <p className="name">{props.name}</p>
          <p className="mail">{props.mail}</p>
        </div>
      </div>
      <div className="choice">
        <svg onClick={() => props.onAccept(props.id)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="rgba(255,255,255,1)"
        >
          <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
        </svg>
        <svg onClick={() => props.onDecline(props.id)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="rgba(0,0,0,1)"
        >
          <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
        </svg>
      </div>
    </div>
  );
}
