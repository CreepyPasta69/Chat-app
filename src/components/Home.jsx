import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  query,
  collection,
  where,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import Request from "./Request";

import "./Home.css";

export default function Home(props) {
  if (!props.uid) {
    return <div className="loding">Loading...</div>;
  }

  const [addFriendVisibility, setAddFriendVisibility] = useState(false);
  const [friendRequestsVisibility, setFriendRequestsVisibility] =
    useState(false);
  const [friendsListVisibility, setFriendsListVisibility] = useState(false);

  const [mailId, setMailId] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    loadFriendRequests();
  }, []);

  useEffect(() => {
    if (friendRequestsVisibility) {
      loadFriendRequests();
    }
    if (friendsListVisibility) {
      loadFriendsList();
    }
  }, [friendRequestsVisibility, friendsListVisibility]);

  const sendFriendRequest = async (senderId, recieverEmail) => {
    try {
      const senderRef = doc(db, "users", senderId);
      const senderDoc = await getDoc(senderRef); // need for checking whether request already sent or not

      const q = query(
        collection(db, "users"),
        where("email", "==", recieverEmail)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("User with that email does not exist.");
      }

      const recieverId = querySnapshot.docs[0].data().uid;
      const recieverRef = doc(db, "users", recieverId);
      const recieverDoc = await getDoc(recieverRef);

      console.log(recieverId);

      await updateDoc(senderRef, {
        "friendRequests.sent": arrayUnion(recieverId),
      });

      await updateDoc(recieverRef, {
        "friendRequests.recieved": arrayUnion(senderId),
      });
    } catch (error) {
      console.log("Error while sending Friend Request : ", error);
    }
  };

  const loadFriendRequests = async () => {
    const userRef = doc(db, "users", props.uid);
    const userFriendRequests = (await getDoc(userRef)).data().friendRequests
      .recieved;

    const friendRequests = await Promise.all(
      userFriendRequests.map(async (friendId) => {
        const friendRef = doc(db, "users", friendId);
        const friendDoc = (await getDoc(friendRef)).data();
        return {
          id: friendId,
          name: friendDoc.displayName,
          mail: friendDoc.email,
          profile: friendDoc.photoURL,
        };
      })
    );
    setFriendRequests(friendRequests);
  };

  const loadFriendsList = async () => {
    const userRef = doc(db, "users", props.uid);
    const userFirendsList = (await getDoc(userRef)).data().friends;

    const friendsList = await Promise.all(
      userFirendsList.map(async (friendId) => {
        const friendRef = doc(db, "users", friendId);
        const friendDoc = (await getDoc(friendRef)).data();
        return {
          id: friendId,
          name: friendDoc.displayName,
          mail: friendDoc.email,
          profile: friendDoc.photoURL,
        };
      })
    );
    setFriendsList(friendsList);
  };

  const acceptFriendRequest = async (friendId) => {
    const userRef = doc(db, "users", props.uid);
    const friendRef = doc(db, "users", friendId);

    try {
      await updateDoc(userRef, {
        friends: arrayUnion(friendId),
        "friendRequests.recieved": arrayRemove(friendId),
        "friendRequests.sent": arrayRemove(friendId),
      });

      await updateDoc(friendRef, {
        friends: arrayUnion(props.uid),
        "friendRequests.recieved": arrayRemove(props.uid),
        "friendRequests.sent": arrayRemove(props.uid),
      });

      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== friendId)
      );

      const chatQuery = query(
        collection(db, "chats"),
        where("participants", "array-contains", props.uid)
      );
      const chatDocs = await getDocs(chatQuery);

      let existingChatId = null;
      chatDocs.forEach((doc) => {
        const chatData = doc.data();
        if (chatData.participants.includes(friendId)) {
          existingChatId = doc.id;
        }
      });

      if (existingChatId) {
        const chatRef = doc(db, "chats", existingChatId);
        await updateDoc(chatRef, {
          updatedAt: new Data().toISOString(),
        });
      } else {
        const chatId = uuidv4();
        const chatRef = doc(db, "chats", chatId);

        await setDoc(chatRef, {
          chatId: chatId,
          participants: [props.uid, friendId],
          messages: [],
          lastMessage: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log("Friend Request Accepted");
    } catch (error) {
      console.log("Error occured while accepting Friend Request : ", error);
    } finally {
      loadFriendRequests();
    }
  };

  const declineFriendRequest = async (friendId) => {
    const userRef = doc(db, "users", props.uid);
    const friendRef = doc(db, "users", friendId);

    try {
      await updateDoc(userRef, {
        "friendRequests.recieved": arrayRemove(friendId),
      });

      await updateDoc(friendRef, {
        "friendRequests.sent": arrayRemove(props.uid),
      });

      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== friendId)
      );

      console.log("Friend Request Declined");
    } catch (error) {
      console.log("Error occured while declining Friend Request : ", error);
    } finally {
      loadFriendRequests();
    }
  };

  const requests = friendRequests.map((friend) => (
    <Request
      key={friend.id}
      id={friend.id}
      name={friend.name}
      mail={friend.mail}
      profile={friend.profile}
      onAccept={acceptFriendRequest}
      onDecline={declineFriendRequest}
    />
  ));

  const friends = friendsList.map((friend) => {
    return (
      <div className="friend" key={friend.id}>
        <img src={friend.profile} alt="" />
        <div className="details">
          <p className="name">{friend.name}</p>
          <p className="mail">{friend.mail}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="home">
      <div className="notification">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V18H18V10ZM20 18.6667L20.4 19.2C20.5657 19.4209 20.5209 19.7343 20.3 19.9C20.2135 19.9649 20.1082 20 20 20H4C3.72386 20 3.5 19.7761 3.5 19.5C3.5 19.3918 3.53509 19.2865 3.6 19.2L4 18.6667V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V18.6667ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path>
        </svg>
      </div>

      <div className="intro">
        <h1>Welcome, {props.displayName}</h1>
        <p>
          "Love is that condition in which the happiness of another person is
          essential to your own."
        </p>
      </div>
      <div className="divider"></div>
      <div className="friends-mannagement">
        <div
          className="add-friend-btn"
          onClick={() => {
            setAddFriendVisibility(true);
            setFriendRequestsVisibility(false);
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
            setAddFriendVisibility(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14 14.252V16.3414C13.3744 16.1203 12.7013 16 12 16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM19.4184 17H23.0042V19H19.4184L21.2469 20.8284L19.8326 22.2426L15.59 18L19.8326 13.7574L21.2469 15.1716L19.4184 17Z"></path>
          </svg>
          <p>Friend Requests</p>
          <span>
            {friendRequests.length == true && <p>{friendRequests.length}</p>}
          </span>
        </div>
        <div
          className="friends-list-btn"
          onClick={() => setFriendsListVisibility(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,1)"
          >
            <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.5271L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z"></path>
          </svg>
          <p>Friends List</p>
        </div>
      </div>
      {addFriendVisibility && (
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
                sendFriendRequest(props.uid, mailId.toLowerCase());
                setMailId("");
              }}
            >
              Search
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
          {friendRequests.length == 0 ? (
            <p>No friend requests right now.....</p>
          ) : (
            <p>Someone wants to be your friend</p>
          )}

          <div className="requests">{requests}</div>
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
      {friendsListVisibility && (
        <div className="friends-list">
          <h2>Friends</h2>
          <div className="friends">{friends}</div>
          <svg
            className="back"
            onClick={() => {
              setFriendsListVisibility(false);
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
