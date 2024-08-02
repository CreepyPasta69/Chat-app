import React from "react";
import SideBar from "./SideBar";
import ChatBox from "./ChatBox";

import "./App.css"

export default function App(){
    return(
        <div className="app">
            <SideBar />
            <ChatBox />
        </div>
    )
}