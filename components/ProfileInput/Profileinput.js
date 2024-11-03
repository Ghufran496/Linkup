// components/ProfileInputComponent.js
import React from "react";
import classes from "./ProfileInput.module.css";

const ProfileInputComponent = () => {
  return (
    <div className={classes.profileContainer}>
      <div className={classes.row}>
        <div className={classes.inputGroup}>
          <label className={classes.label}>Whats your full name?</label>
          <p className={classes.description}>Please fill in your name.</p>
          <input
            type="text"
            className={classes.inputField}
            placeholder="Name"
          />
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.label}>
            Would you like to display your full name?
          </label>
          <p className={classes.description}>
            Do you want us to display your first and last name? Please choose a
            format.
          </p>
          <div className={classes.displayOptions}>
            <button className={classes.optionButton}>Max</button>
            <button className={classes.optionButton}>Max M.</button>
            <button className={classes.optionButton}>Max Muster</button>
          </div>
        </div>
      </div>

      <div className={classes.row}>
        <div className={classes.inputGroup}>
          <label className={classes.label}>How old are you?</label>
          <p className={classes.description}>Please fill in your age.</p>
          <input
            type="number"
            className={classes.inputField}
            placeholder="Age"
          />
        </div>

        <div
          className={`${classes.inputGroup} ${classes.addPadding} ${classes.paddingforspace}`}
        >
          <label className={classes.label}>What is your gender?</label>
          <p className={classes.description}>
            Please tell us with what gender you identify with.
          </p>
          <input
            type="text"
            className={classes.inputField}
            placeholder="Gender"
          />
        </div>
      </div>

      <div className={`${classes.inputGroup} ${classes.optionSpaceBottom}`}>
        <label className={classes.label}>Where do you live?</label>
        <p className={classes.description}>
          Please tell us where you live or if you're traveling you can change
          the location later on your profile page.
        </p>
        <input
          type="text"
          className={`${classes.inputField} ${classes.addPaddingRight}`}
          placeholder="Location"
        />
      </div>

      <div className={classes.row}>
        <div className={classes.inputGroup}>
          <label className={classes.label}>
            Tell us about yourself (optional)
          </label>
          <p className={classes.description}>
            If you tell us about yourself we can display more information to a
            potential acquaintance/friend.
          </p>
          <textarea className={classes.textArea}></textarea>
        </div>

        <button className={classes.submitButton}>Submit</button>
      </div>
    </div>
  );
};

export default ProfileInputComponent;
