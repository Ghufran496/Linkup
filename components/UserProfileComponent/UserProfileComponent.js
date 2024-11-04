import React from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { useUser } from "../../context/UserContext";
import classes from "./UserProfileComponent.module.css";

const UserProfileComponent = () => {
  const router = useRouter();
  const { setUserId } = useUser(); 

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

  return (
    <div>
      <h1>Profile content goes here</h1>
      <button onClick={handleLogout} className={classes.logoutButton}>Logout</button>
    </div>
  );
};

export default UserProfileComponent;
