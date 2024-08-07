import React, { useState } from "react";

import logo from "/src/assets/logo.png";
import indicator from "../assets/indicator.svg";
import logout from "../assets/logout.svg";

import "./SideBar.css";

export default function SideBar(props) {
  const menuItemsData = [
    {
      id: "Home",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="rgba(29,31,43,1)"
        >
          <path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM19 19V9.97815L12 4.53371L5 9.97815V19H19Z"></path>
        </svg>
      ),
      label: "Home",
    },
    {
      id: "Chat",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="rgba(29,31,43,1)"
        >
          <path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"></path>
        </svg>
      ),
      label: "Chat",
    },
    {
      id: "Friends",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path>
        </svg>
      ),
      label: "Friends",
    },
  ];

  const menuItem = menuItemsData.map((menu) => (
    <div
      key={menu.id}
      className={`menu-element ${props.activeMenu === menu.id ? "active" : ""}`}
      onClick={() => props.setActiveMenu(menu.id)}
    >
      {menu.icon}
      <p>{menu.label}</p>
    </div>
  ));

  return (
    <div className="sidebar">
      <div className="hero">
        <img src={logo} alt="logo" onClick={() => alert("Echo")} />
      </div>
      <div className="menu">
        {...menuItem}
        <img src={indicator} alt="" id="indicator" />
      </div>
      <div className="logout">
        <img src={logout} alt="logout" onClick={props.logout} />
      </div>
    </div>
  );
}
