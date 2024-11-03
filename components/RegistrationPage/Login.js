import React from "react";
import styles from "./Login.module.css";
export default function Login() {
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
        />
        <h2 className={styles.heading}>Password</h2>
        <input
          type="password"
          className={styles.inputField}
          placeholder="Enter your password"
        />
        <div className={styles.buttonContainer}>
          <button className={styles.loginButton}>Login</button>
          <button className={styles.registerButton}>Register</button>
        </div>
      </div>
    </div>
  );
}
