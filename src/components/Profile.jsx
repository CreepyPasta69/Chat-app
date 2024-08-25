import React, { useState } from "react";
import { db, storage } from "../firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

import "./Profile.css";

export default function Profile(props) {
  if (!props.userData) {
    return <div className="loading">Loading...</div>;
  }

  const { uid, displayName, email, photoURL, createdAt, friends } =
    props.userData;
  const [userName, setUserName] = useState(displayName);
  const [previewURL, setPreviewURL] = useState(photoURL);
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const isChanged = isEditing || photoURL !== previewURL;

  const saveChanges = async () => {
    if (previewURL !== photoURL) {
      try {
        const storageRef = ref(storage, `profilePicture/${uid}`);
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);

        props.setUserData((prevData) => {
          ({
            ...prevData,
            photoURL: downloadURL,
          });
        });

        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
          photoURL: downloadURL,
        });
      } catch (error) {
        console.log("Error while updating Profile Picture: ", error);
      }
    }
    if (userName !== displayName) {
      try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
          displayName: userName,
        });

        props.setUserData((prevData) => {
          ({
            ...prevData,
            displayName: userName,
          });
        });

      } catch (error) {
        console.log("Error while updating Name: ", error);
      }
    }
  };

  const discardChanges = () => {
    setUserName(displayName);
    setPreviewURL(photoURL);
    setIsEditing(false);
  };

  const handleUpload = (file) => {
    if (file) {
      if (file.size > 5242880) {
        alert("Image size should not exceed 5MB");
        return;
      }
      try {
        const imageUrl = URL.createObjectURL(file);
        setPreviewURL(imageUrl);
        setImageFile(file);
      } catch (error) {
        console.log("Error while uploading:", error);
      }
    }
  };

  function formatDate(date) {
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });

    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${day}${suffix} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  }

  return (
    <div className="profile">
      <h1>Profile</h1>
      <div>
        <div className="profile-picture">
          <img src={previewURL} alt="User Avatar" />
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
          {isChanged && (
            <div className="change">
              <button className="save" onClick={saveChanges}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 19V13H17V19H19V7.82843L16.1716 5H5V19H7ZM4 3H17L21 7V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM9 15V19H15V15H9Z"></path>
                </svg>
                Save
              </button>
              <button className="discard" onClick={discardChanges}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                </svg>
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="profile-details">
          {/* <h2>Details :</h2> */}

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
                userName
              )}
            </p>
            {!isEditing && (
              <svg
                onClick={() => {
                  setIsEditing(true);
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="rgba(255,255,255,1)"
              >
                <path d="M12.8995 6.85453L17.1421 11.0972L7.24264 20.9967H3V16.754L12.8995 6.85453ZM14.3137 5.44032L16.435 3.319C16.8256 2.92848 17.4587 2.92848 17.8492 3.319L20.6777 6.14743C21.0682 6.53795 21.0682 7.17112 20.6777 7.56164L18.5563 9.68296L14.3137 5.44032Z"></path>
              </svg>
            )}
          </div>

          <p>
            <b>Email: </b>
            <br />
            {email}
          </p>
          <p>
            <b>Date joined: </b>
            <br />
            {formatDate(createdAt.toDate())}
          </p>
          <p>
            <b>Friends: </b>
            <br />
            {friends.length}
          </p>
        </div>
      </div>
    </div>
  );
}
