import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { database } from "../../lib/firebaseConfig";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import classes from "./UserProfileComponent.module.css";

const UserProfileComponent = () => {
  const router = useRouter();
  const { userId, setUserId } = useUser();
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // Holds selected file
  const [uploading, setUploading] = useState(false); // Track upload status
  const [showModal, setShowModal] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    if (userId) {
      const userRef = ref(database, `users/${userId}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData({
              ...data.inputfields,
              likes: data.likedActivities || [],
              dislikes: data.noGoActivities || [],
            });
          } else {
            console.log("No user data available");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId]);
  const messageButton = () => {
    router.push("/messages");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserId(null);
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("redirectAfterRegister");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const searchButton = () => {
    router.replace("/search");
  };
  const editButton = () => {
    router.replace("/editprofile");
  };

  // Handle file selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  // Upload image to Cloudinary and get URL
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ipqbt6og"); // Replace with your preset name

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dnngcpjke/image/upload`, // Replace with your Cloudinary details
        formData
      );
      return response.data.secure_url; // URL of uploaded image
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  // Save the profile image URL to Firebase
  const saveProfileImage = async () => {
    if (!profileImage || !userId) return;
    setUploading(true);

    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(profileImage);
      if (imageUrl) {
        // Save image URL in Firebase
        const userRef = ref(database, `users/${userId}/inputfields`);
        await set(userRef, { ...userData, profileImage: imageUrl });
        setUserData((prevData) => ({ ...prevData, profileImage: imageUrl })); // Update state
        setProfileImage(null); // Clear selected file
      }
    } catch (error) {
      console.error("Error saving profile image:", error);
    } finally {
      setUploading(false);
    }
  };
  const toggleModal = () => {
    setShowModal(!showModal); // Toggle modal visibility
  };
  return (
    <div className={classes.container}>
      <aside className={classes.sidebar}>
        <div className={classes.topSection}>
          <span className={classes.hamburgerMenu}>☰</span>
          <h2 className={classes.title}>Constructor</h2>
          <span className={classes.moreIcon}>⋮</span>
        </div>
        <div className={classes.profileSection}>
          <img
            src={userData?.profileImage || "/Images/image.jpg"} // Default image if profile image is not provided
            alt="Profile"
            className={classes.profileImage}
          />
          <p className={classes.profileName}>
            {userData?.displayName || "User"}
          </p>
        </div>

        <nav className={classes.navMenu}>
          <div className={`${classes.menuItem} ${classes.active}`}>
            <span className={classes.icon}>📅</span>
            <span>Calendars</span>
            <span className={classes.notificationDot}></span>
          </div>
          <div className={classes.menuItem} onClick={messageButton}>
            <span className={classes.icon}>👥</span>
            <span>Messages</span>
          </div>
          <div className={classes.menuItem}>
            <span className={classes.icon}>🔥</span>
            <span>Events</span>
          </div>
          <div className={classes.menuItem}>
            <span className={classes.icon}>🛠️</span>
            <span>Settings</span>
          </div>
        </nav>
        <button onClick={handleLogout} className={classes.logoutButton}>
          Logout
        </button>
      </aside>
      <div style={{ width: "100%" }}>
        <main className={classes.mainContent}>
          <button onClick={toggleModal} className={classes.showPopupButton}>
            Upload Pic
          </button>
          {showModal && (
            <div className={classes.modalOverlay}>
              <div className={classes.modalContent}>
                <h2>Upload Your Profile Pic</h2>
                <div className={classes.imageUploadSection}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <button
                    onClick={saveProfileImage}
                    disabled={uploading || !profileImage}
                    className={classes.uploadButton}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
                <button onClick={toggleModal} className={classes.closeButton}>
                  Close
                </button>
              </div>
            </div>
          )}
          <button onClick={editButton} className={classes.editButton}>
            Edit
          </button>
          <button onClick={searchButton} className={classes.searchButton}>
            Search
          </button>
        </main>

        <div
          className={classes.profileInfo}
          style={{
            display: "flex",
            gap: "5rem",
            justifyContent: "space-evenly",
          }}
        >
          <div>
            <h4>About me</h4>
            <div>
              <p className={classes.bio}>
                {userData?.about || "No bio provided"}
              </p>
            </div>
          </div>
          <div>
            <h4>Likes</h4>
            <div className={classes.tags}>
              {userData?.likes?.map((like, idx) => (
                <span key={idx} className={classes.tagLike}>
                  {like}
                </span>
              ))}
            </div>

            <h4>Dislikes</h4>
            <div className={classes.tags}>
              {userData?.dislikes?.map((dislike, idx) => (
                <span key={idx} className={classes.tagDislike}>
                  {dislike}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileComponent;
