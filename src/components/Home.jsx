import React, { useState } from "react";
import {db} from "../firebase.js"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

import Request from "./Request";

import "./Home.css";

export default function Home(props) {
  if (!props.uid) {
    return <div className="loding">Loading...</div>;
  }

  const [addFriedVisibility, setAddFriendVisibility] = useState(false);
  const [friendRequestsVisibility, setFriendRequestsVisibility] =
    useState(false);

  const [mailId, setMailId] = useState("");

  const sendFriendRequest = async (senderId, recieverId) => {
    
    const senderRef = doc(db, "users", senderId)
    const senderDoc = await getDoc(senderRef)

    const recieverRef = doc(db, "users", recieverId)
    const recieverDoc = await getDoc(recieverRef)

    await updateDoc(senderRef, {
      'friendRequests.sent' : arrayUnion(recieverId)
    })

    await updateDoc(recieverRef, {
      'friendRequests.recieved' : arrayUnion(senderId)
    })
  };

  return (
    <div className="home">
      <h1>Welcome, {props.displayName}</h1>
      <div className="friends-mannagement">
        <div
          className="add-friend-btn"
          onClick={() => {
            setAddFriendVisibility(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,1)"
          >
            <path d="M14 14.252V16.3414C13.3744 16.1203 12.7013 16 12 16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z"></path>
          </svg>
          <p>Add a Friend</p>
        </div>
        <div
          className="friend-requests-btn"
          onClick={() => {
            setFriendRequestsVisibility(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,1)"
          >
            <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.5271L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z"></path>
          </svg>
          <p>Friend Requests</p>
          <span>
            <p>3</p>
          </span>
        </div>
      </div>
      {addFriedVisibility && (
        <div className="add-friend">
          <h2>Add a Friend</h2>
          <p>Enter the mail of the User</p>
          <div className="input">
            <input
              type="text"
              placeholder="Enter e-mail"
              value={mailId}
              onChange={(e) => {
                setMailId(e.target.value);
              }}
            />
            <button
              onClick={() => {
                sendFriendRequest(props.uid,"zugwtldtaCahbdUfFMlXCyppBW82")
                setMailId("");
              }}
            >
              Send Request
            </button>
          </div>

          <svg
            className="back"
            onClick={() => {
              setMailId("");
              setAddFriendVisibility(false);
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,1)"
          >
            <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
          </svg>
        </div>
      )}
      {friendRequestsVisibility && (
        <div className="friend-requests">
          <h2>Friend Requests</h2>
          Someone wants to be your friend
          <div className="requests">
            <Request />
            <Request />
          </div>
          <svg
            className="back"
            onClick={() => {
              setFriendRequestsVisibility(false);
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,1)"
          >
            <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
          </svg>
        </div>
      )}
    </div>
  );
}
