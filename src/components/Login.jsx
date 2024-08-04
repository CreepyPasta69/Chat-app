import React from "react";

import "./Login.css"

export default function Login(props){
    return(
        <div className="login">
            <h1>Hello User</h1>
            <p>Login required to continue to the app</p>
            <button onClick={props.login}><img src="src/assets/google.png" alt="" /><p>Login</p></button>
        </div>
    )
}