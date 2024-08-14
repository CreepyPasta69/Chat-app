import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
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

export default function ChatBox(props) {
  const [currentContact, setCurrentContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState({});

  useEffect(() => {
    const chatQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", props.uid)
    );

    const unSub = onSnapshot(chatQuery, async (querySnapshot) => {
      const updatedChats = {};
      const contactIds = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        updatedChats[doc.id] = data;

        const contactId = data.participants.find((user) => user !== props.uid);

        if (contactId) {
          contactIds.push(contactId);
        }
      });

      const contacts = await Promise.all(
        contactIds.map(async (contactId) => {
          const contactRef = doc(db, "users", contactId);
          const contactDoc = (await getDoc(contactRef)).data();

          return {
            id: contactDoc.uid,
            name: contactDoc.displayName,
            mail: contactDoc.email,
            profile: contactDoc.photoURL,
            isActive: contactDoc.isActive,
          };
        }
      )
        
      );
      setContacts(contacts);
      setChats(updatedChats);
    });

    return () => unSub();
  }, [props.uid]);

  return (
    <div className="chatbox">
      <ContactMenu data={contacts} setCurrentContact={setCurrentContact} />
      <ChatArea uid={props.uid} currentContact={currentContact} chats={chats} />
    </div>
  );
}
