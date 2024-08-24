import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";

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

          const chat = Object.values(updatedChats).find((chat) =>
            chat.participants.includes(contactId)
          );

          return {
            id: contactDoc.uid,
            name: contactDoc.displayName,
            email: contactDoc.email,
            profile: contactDoc.photoURL,
            updatedAt: chat.updatedAt?.toMillis() || 0,
            lastMessage: chat.lastMessage?.text || "...",
            unreadMessages: chat.messages.filter(
              (msg) => msg.sender !== props.uid && msg.read === false
            ).length,
          };
        })
      );

      contacts.sort((a, b) => b.updatedAt - a.updatedAt);

      setContacts(contacts);
      setChats(updatedChats);
    });

    return () => unSub();
  }, [props.uid]);

  return (
    <div className="chatbox">
      <ContactMenu data={contacts} currentContact={currentContact} setCurrentContact={setCurrentContact} />
      <ChatArea uid={props.uid} currentContact={currentContact} chats={chats} />
    </div>
  );
}