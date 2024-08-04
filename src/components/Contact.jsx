import React from "react";
import profile from "../assets/profile.png"
import "./Contact.css"

export default function Contact(){
    return(
        <div className="contact">
            <img src={profile} alt="" />
            <p>Name</p>
        </div>
    )
}