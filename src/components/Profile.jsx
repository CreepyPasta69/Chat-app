import React, { useState } from "react";
import { db, storage } from "../firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

import "./Profile.css";

export default function Profile(props) {
  if (!props.userData) {
    return <div className="loading">Loading...</div>;
  }

  const { uid, displayName, email, photoURL, createdAt } = props.userData;
  const [userName, setUserName] = useState(displayName);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpload = async (file) => {
    if (file) {
      if(file.size > 52,42,880){
        alert("Image size should not exceed 5MB")
        return;
      }
      const storageRef = ref(storage, `profilePicture/${uid}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
          photoURL: downloadUrl,
        });

        props.setUserData((prevData) => {
          ({
            ...prevData,
            photoURL: downloadUrl,
          });
        });
      } catch (error) {
        console.log("Error while uploading:", error);
      }
    }
  };

  return (
    <div className="profile">
      <h1>Profile</h1>
      <div>
        <div className="profile-picture">
          <img src={photoURL} alt="User Avatar" />
          <label htmlFor="imageUpload">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="rgba(103,133,255,1)"
            >
              <path d="M4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19ZM14 9V15H10V9H5L12 2L19 9H14Z"></path>
            </svg>
            <p>Upload Profile Picture</p>
            <input
              type="file"
              id="imageUpload"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => {
                handleUpload(e.target.files[0]);
              }}
            />
          </label>
        </div>
        <div className="profile-details">
          <div className="name">
            <p>
              <b>Name: </b>
              <br />
              {isEditing ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              ) : (
                displayName
              )}
            </p>
            <svg
              onClick={() => setIsEditing((prevState) => !prevState)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="rgba(255,255,255,1)"
            >
              <path d="M12.8995 6.85453L17.1421 11.0972L7.24264 20.9967H3V16.754L12.8995 6.85453ZM14.3137 5.44032L16.435 3.319C16.8256 2.92848 17.4587 2.92848 17.8492 3.319L20.6777 6.14743C21.0682 6.53795 21.0682 7.17112 20.6777 7.56164L18.5563 9.68296L14.3137 5.44032Z"></path>
            </svg>
          </div>

          <p>
            <b>Email: </b>
            <br />
            {email}
          </p>
          <p>
            <b>Date joined: </b>
            <br />
            {createdAt.toDate().toLocaleString()}
          </p>
          <button>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
