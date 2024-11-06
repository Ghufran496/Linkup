// ProfileInputComponent.js

import React, { useState } from "react";
import Select from "react-select"; // Import the React Select component
import { ref, set } from "firebase/database";
import { useRouter } from "next/router";
import { database } from "../../lib/firebaseConfig";
import { useUser } from "../../context/UserContext";
import classes from "./ProfileInput.module.css";
import { LuLoader } from "react-icons/lu";

// Define location options
const locationOptions = [
  { value: "Bauma", label: "Bauma" },
  { value: "Elgg", label: "Elgg" },
  { value: "Fehraltdorf", label: "Fehraltdorf" },
  { value: "Feldmeilen", label: "Feldmeilen" },
  { value: "Glattfelden", label: "Glattfelden" },
  { value: "Hombrechtikon", label: "Hombrechtikon" },
  { value: "Horgen", label: "Horgen" },
  { value: "Kilchberg ZH", label: "Kilchberg ZH" },
  { value: "Kloten", label: "Kloten" },
  { value: "Mannedorf", label: "Mannedorf" },
  { value: "Meilen", label: "Meilen" },
  { value: "Pfaffikon", label: "Pfaffikon" },
  { value: "Pfaffikon ZH", label: "Pfaffikon ZH" },
  { value: "Richterswil", label: "Richterswil" },
  { value: "Ruschlikon", label: "Ruschlikon" },
  { value: "Ruti", label: "Ruti" },
  { value: "Schlatt", label: "Schlatt" },
  { value: "Stafa", label: "Stafa" },
  { value: "Thalwil", label: "Thalwil" },
  { value: "Wadenswil", label: "Wadenswil" },
  { value: "Winterthur", label: "Winterthur" },
  { value: "Zumikon", label: "Zumikon" },
  { value: "Zurich", label: "Zurich" },
];

const ProfileInputComponent = () => {
  const router = useRouter();
  const { userId } = useUser();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState(null); // Update location to hold an object
  const [about, setAbout] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const validateFullName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateAge = (age) => age >= 18 && age <= 100;

  const getDisplayName = () => {
    const [firstName, lastName] = fullName.split(" ");
    if (selectedOption === "Max") {
      return firstName || "";
    } else if (selectedOption === "Max M.") {
      return `${firstName} ${lastName?.charAt(0) || ""}.`;
    } else if (selectedOption === "Max Muster") {
      return fullName;
    }
    return fullName;
  };

  const handleLocationChange = (selectedOption) => {
    setLocation(selectedOption); // Update location state with the selected option
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    if (!userId) {
      setIsLoading(false);
      showError("User ID not found. Please log in again.");
      return;
    }

    if (!fullName.trim() || !validateFullName(fullName)) {
      setIsLoading(false);
      showError(
        "Full name is required and must contain only alphabetic characters."
      );
      return;
    }

    if (!selectedOption) {
      setIsLoading(false);
      showError("Please select a display name format.");
      return;
    }

    if (!age || isNaN(age) || !validateAge(age)) {
      setIsLoading(false);
      showError("Please enter a valid age between 18 and 100.");
      return;
    }

    if (!gender.trim()) {
      setIsLoading(false);
      showError("Gender is required.");
      return;
    }

    if (!location) {
      setIsLoading(false);
      showError("Please select a location.");
      return;
    }

    const displayName = getDisplayName();
    const userRef = ref(database, `users/${userId}/inputfields`);
    const profileData = {
      fullName,
      displayName,
      age,
      gender,
      location: location.value, // Save only the value of the selected option
      about,
    };

    await set(userRef, profileData)
      .then(() => {
        setIsLoading(false);
        router.push("/activities");
      })
      .catch((error) => {
        setIsLoading(false);
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
            Do you want us to display your full name?
          </label>
          <p className={classes.description}>Please choose a format.</p>
          <div className={classes.displayOptions}>
            <label>
              <input
                type="radio"
                name="displayOption"
                value="Max"
                checked={selectedOption === "Max"}
                onChange={() => setSelectedOption("Max")}
              />
              Max
            </label>
            <label>
              <input
                type="radio"
                name="displayOption"
                value="Max M."
                checked={selectedOption === "Max M."}
                onChange={() => setSelectedOption("Max M.")}
              />
              Max M.
            </label>
            <label>
              <input
                type="radio"
                name="displayOption"
                value="Max Muster"
                checked={selectedOption === "Max Muster"}
                onChange={() => setSelectedOption("Max Muster")}
              />
              Max Muster
            </label>
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

        <div className={`${classes.inputGroup} ${classes.addPadding}`}>
          <label className={classes.label}>What is your gender?</label>
          <p className={classes.description}>
            Please tell us what gender you identify with.
          </p>
          <select
            className={classes.inputField}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className={`${classes.inputGroup}`}>
        <label className={classes.label}>Where do you live?</label>
        <p className={classes.description}>
          Please fill in where you live, or if traveling, update later.
        </p>
        <Select
          className={classes.inputLocation}
          options={locationOptions}
          value={location}
          onChange={handleLocationChange}
          placeholder="Select Location"
          isSearchable
        />
      </div>

      <div className={classes.row}>
        <div className={classes.inputGroup}>
          <label className={classes.label}>
            Tell us about yourself (optional)
          </label>
          <p className={classes.description}>
            If you tell us about yourself, we can display more information to
            potential acquaintances.
          </p>
          <textarea
            className={classes.textArea}
            maxLength="500"
            placeholder="Tell us about yourself"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
        </div>
        <button onClick={handleSubmit} className={classes.submitButton}>
          {isLoading ? <LuLoader /> : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ProfileInputComponent;
