import React, { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../firebase.js";

import ContactMenu from "./ContactMenu";
import ChatArea from "./ChatArea";
import "./ChatBox.css";

import { contacts } from "../contacts";

export default function ChatBox(props) {
  const [contactData, setContactData] = useState(contacts);
  const [currentContact, setCurrentContact] = useState(contactData[0]);

  const [chat, setChat] = useState({});

  useEffect(() => {
    const q = query(
      collection(db, "userChat"),
      where("participants", "array-contains", props.uid)
    );

    const unSub = onSnapshot(q, (querySnapshot) => {
      const chatArray = [];
      querySnapshot.forEach((doc) => {
        chatArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setChat(chatArray);
    });

    return () => unSub();
  }, [props.uid]);

  return (
    <div className="chatbox">
      <ContactMenu data={contactData} setCurrentContact={setCurrentContact} />
      <ChatArea currentContact={currentContact} />
    </div>
  );
}
