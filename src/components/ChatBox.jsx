import React, {useState} from "react";
import ContactMenu from "./ContactMenu"
import ChatArea from "./ChatArea"
import "./ChatBox.css";

export default function ChatBox() {

  const [visible, setVisible] = useState(true);

  function toggle(){
    setVisible((prevState)=>(!prevState))
  }

  return (
    <div className="chatbox">
      <ContactMenu toggle={toggle} state={visible}/>
      <ChatArea toggle={toggle} state={visible}/>
    </div>
  );
}
