import React, { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useUser } from "../../context/UserContext"; 
import styles from "./Login.module.css";
import { LuLoader } from "react-icons/lu";

export default function Login() {
  const router = useRouter();
  const { setUserId } = useUser(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setError("");

    if (!validateEmail(email)) {
      showError("Invalid email format");
      setIsLoginLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      showError("Password too short");
      setIsLoginLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      setUserId(userId); 
      setIsLoginLoading(false);
      router.push("/userprofile"); 
    } catch (error) {
      setIsLoginLoading(false);
      showError("Username or password is incorrect");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    setError("");

    if (!validateEmail(email)) {
      showError("Invalid email format");
      setIsRegisterLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      showError("Password too short");
      setIsRegisterLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      setUserId(userId); 
      sessionStorage.setItem("userId", userId); 
      sessionStorage.setItem("redirectAfterRegister", "true"); 
      setIsRegisterLoading(false);
      router.push("/profileinput"); 
    } catch (error) {
      setIsRegisterLoading(false);
      showError("Error registering: " + error.message);
    }
  };

  const isLoginDisabled = !validateEmail(email) || !validatePassword(password);

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
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <h2 className={styles.heading}>Password</h2>
        <input
          type="password"
          className={styles.inputField}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.buttonContainer}>
          <button
            onClick={handleLogin}
            className={`${styles.loginButton} ${isLoginDisabled ? styles.loginButtonDisabled : ""}`}
            disabled={isLoginDisabled}
          >
             {isLoginLoading ? <LuLoader /> : "Login"}  
          </button>
          <button onClick={handleRegister} className={styles.registerButton}>
          {isRegisterLoading ? <LuLoader /> : "Register"}  
          </button>
        </div>
      </div>
    </div>
  );
}

