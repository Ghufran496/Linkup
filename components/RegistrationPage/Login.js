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
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
  };

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      showError("Password must be at least 8 characters long.");
      return;
    }

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
      showError("Username or password is incorrect");
    }
  };

  // Function to handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      showError("Password must be at least 8 characters long.");
      return;
    }

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
      showError("Error registering: " + error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {error && <div className={styles.errorPopup}>{error}</div>}
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
