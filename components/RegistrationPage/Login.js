// components/Login.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useUser } from "../../context/UserContext"; // Import the UserContext
import styles from "./Login.module.css";

export default function Login() {
  const router = useRouter();
  const { setUserId } = useUser(); // Access the setUserId function from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      setUserId(userId); // Set userId in context
      router.push("/profileinput"); // Redirect without passing userId in URL
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  // Function to handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      setUserId(userId); // Set userId in context
      router.push("/profileinput"); // Redirect without passing userId in URL
    } catch (error) {
      console.error("Error registering:", error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logo}>
        <img src="/Images/logo.png" alt="Logo" />
      </div>
      <div className={styles.formContainer}>
        <h2 className={styles.heading}>Email-Address</h2>
        <input
          type="email"
          className={styles.inputField}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <h2 className={styles.heading}>Password</h2>
        <input
          type="password"
          className={styles.inputField}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.buttonContainer}>
          <button onClick={handleLogin} className={styles.loginButton}>
            Login
          </button>
          <button onClick={handleRegister} className={styles.registerButton}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
