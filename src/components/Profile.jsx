import React from "react";

import "./Profile.css";

export default function Profile(props) {

  if (!props.userData) {
    return <div className="loading">Loading...</div>;
  }

  const { displayName, email, photoURL, createdAt } = props.userData;

  return (
    <div className="profile">
      <div>
        <img src={photoURL} alt="User Avatar" />

        <p>
          <b>Name: </b>
          {displayName}
        </p>
        <p>
          <b>Email: </b>
          {email}
        </p>
        <p>
          <b>Date joined: </b>
          {createdAt.toDate().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
