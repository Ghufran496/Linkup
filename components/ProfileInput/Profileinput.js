// components/ProfileInputComponent.js
import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { useRouter } from "next/router";
import { database } from "../../lib/firebaseConfig";
import { useUser } from "../../context/UserContext";
import classes from "./ProfileInput.module.css";

const ProfileInputComponent = () => {
  const router = useRouter();
  const { userId } = useUser(); // Access userId from context
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
  };

  // Function to format the display name based on selected option
  const getDisplayName = () => {
    const [firstName, lastName] = fullName.split(" ");
    if (selectedOption === "Max") {
      return firstName || ""; // First name only
    } else if (selectedOption === "Max M.") {
      return `${firstName} ${lastName?.charAt(0) || ""}.`; // First name + Last initial
    } else if (selectedOption === "Max Muster") {
      return fullName; // Full name
    }
    return fullName; // Default to full name if no option selected
  };

  // Function to handle form submission with specific validation checks
  const handleSubmit = async () => {
    setError("");

    if (!userId) {
      showError("User ID not found. Please log in again.");
      return;
    }

    if (!fullName.trim()) {
      showError("Full name is required.");
      return;
    }

    if (!selectedOption) {
      showError("Please select a display name format.");
      return;
    }

    if (!age || isNaN(age) || age <= 0) {
      showError("Please enter a valid age.");
      return;
    }

    if (!gender.trim()) {
      showError("Gender is required.");
      return;
    }

    if (!location.trim()) {
      showError("Location is required.");
      return;
    }

    const displayName = getDisplayName();

    const userRef = ref(database, `users/${userId}/inputfields`);
    const profileData = {
      fullName,
      displayName,
      age,
      gender,
      location,
      about,
    };

    await set(userRef, profileData)
      .then(() => {
        router.push("/activities");
      })
      .catch((error) => {
        console.error("Error saving profile data:", error);
        showError("Failed to save profile data. Please try again.");
      });
  };

  return (
    <div className={classes.profileContainer}>
      {error && <div className={classes.errorPopup}>{error}</div>}
      <div className={classes.row}>
        <div className={classes.inputGroup}>
          <label className={classes.label}>What's your full name?</label>
          <p className={classes.description}>Please fill in your name.</p>
          <input
            type="text"
            className={classes.inputField}
            placeholder="Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.label}>
            Would you like to display your full name?
          </label>
          <p className={classes.description}>Please choose a format.</p>
          <div className={classes.displayOptions}>
            <button
              className={`${classes.optionButton} ${
                selectedOption === "Max" ? classes.selected : ""
              }`}
              onClick={() => setSelectedOption("Max")}
            >
              Max
            </button>
            <button
              className={`${classes.optionButton} ${
                selectedOption === "Max M." ? classes.selected : ""
              }`}
              onClick={() => setSelectedOption("Max M.")}
            >
              Max M.
            </button>
            <button
              className={`${classes.optionButton} ${
                selectedOption === "Max Muster" ? classes.selected : ""
              }`}
              onClick={() => setSelectedOption("Max Muster")}
            >
              Max Muster
            </button>
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
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div
          className={`${classes.inputGroup} ${classes.addPadding} ${classes.paddingforspace}`}
        >
          <label className={classes.label}>What is your gender?</label>
          <p className={classes.description}>Please fill in your gender.</p>
          <input
            type="text"
            className={classes.inputField}
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>
      </div>

      <div className={`${classes.inputGroup} ${classes.optionSpaceBottom}`}>
        <label className={classes.label}>Where do you live?</label>
        <p className={classes.description}>Please fill in your location.</p>
        <input
          type="text"
          className={`${classes.inputField} ${classes.addPaddingRight}`}
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className={classes.row}>
        <div className={classes.inputGroup}>
          <label className={classes.label}>
            Tell us about yourself (optional)
          </label>
          <p className={classes.description}>Please fill in a brief bio.</p>
          <textarea
            className={classes.textArea}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
        </div>

        <button onClick={handleSubmit} className={classes.submitButton}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProfileInputComponent;
