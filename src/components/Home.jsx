import React from "react";

import "./Home.css";

export default function Home({ userData }) {
  console.log(userData);

  if(!userData){
    return(
      <div>
        Loading...
      </div>
    )
  }
  const { displayName, email, photoURL, createdAt } = userData;

  return (
    <div className="home">
      <h1>Welcome, {displayName}</h1>
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
