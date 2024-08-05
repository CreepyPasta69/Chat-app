import React, { useState } from "react";
import ContactMenu from "./ContactMenu";
import ChatArea from "./ChatArea";
import "./ChatBox.css";

import { contacts } from "../contacts";

export default function ChatBox() {
  const [contactData, setContactData] = useState(contacts);
  const [currentContact, setCurrentContact] = useState(contactData[0]);
  const [visible, setVisible] = useState(true);

  function show() {
    setVisible(true);
  }

  function hide() {
    setVisible(false);
  }

  return (
    <div className="chatbox">
      <ContactMenu
        toggle={hide}
        state={visible}
        data={contactData}
        setCurrentContact={setCurrentContact}
      />
      <ChatArea
        toggle={show}
        state={visible}
        currentContact={currentContact}
      />
    </div>
  );
}
