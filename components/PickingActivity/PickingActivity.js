// components/PickingActivityComponent.js
import React, { useState } from "react";
import { useUser } from "../../context/UserContext"; // Import the UserContext
import classes from "./PickingActivity.module.css";
import { IoMdSearch } from "react-icons/io";
import { database } from "../../lib/firebaseConfig";
import { ref, set } from "firebase/database";

const activities = [
  "Baking",
  "Ballet",
  "Baseball",
  "Basketball",
  "Beekeeping",
  "Bird Watching",
  "Boardgames",
  "Bodybuilding",
  "Bouldering",
];

const nogoactivities = [
  "Baking",
  "Ballet",
  "Baseball",
  "Basketball",
  "Beekeeping",
  "Bird Watching",
  "Boardgames",
  "Bodybuilding",
  "Bouldering",
];

const PickingActivityComponent = () => {
  const { userId } = useUser(); // Access userId from context
  const [likedActivities, setLikedActivities] = useState([]);
  const [noGoActivities, setNoGoActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noGoSearchQuery, setNoGoSearchQuery] = useState("");

  const filteredActivities = activities.filter((activity) =>
    activity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNoGoActivities = nogoactivities.filter((activity) =>
    activity.toLowerCase().includes(noGoSearchQuery.toLowerCase())
  );

  const handleActivityClick = (activity, setActivities) => {
    setActivities((prevActivities) =>
      prevActivities.includes(activity)
        ? prevActivities.filter((a) => a !== activity)
        : [...prevActivities, activity]
    );
  };

  // Function to submit selected activities to Firebase
  const handleSubmit = () => {
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const data = {
      likedActivities,
      noGoActivities,
    };

    // Reference path in Realtime Database under users/(userId)
    const likedRef = ref(database, `users/${userId}/likedActivities`);
    const noGoRef = ref(database, `users/${userId}/noGoActivities`);

    // Save liked activities
    set(likedRef, likedActivities)
      .then(() => {
        // Save no-go activities after liked activities are saved
        return set(noGoRef, noGoActivities);
      })
      .then(() => {
        alert("Data saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        alert("Failed to save data. Please try again.");
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.section}>
        <h2 className={classes.heading2}>
          Which activities do you like? (multiple selection)
        </h2>
        <p className={classes.paragraph}>
          Please tick all activities that you like to do and would like to meet
          someone with the same interests.
        </p>
        <div className={classes.dropdownContainer}>
          <div>
            <div
              className={classes.searchBar}
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "3px",
              }}
            >
              <IoMdSearch />
              <input
                className={classes.input}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={classes.activityList}>
              {filteredActivities.map((activity) => (
                <div
                  key={activity}
                  className={`${classes.activityItem} ${
                    likedActivities.includes(activity) ? classes.selected : ""
                  }`}
                  onClick={() =>
                    handleActivityClick(activity, setLikedActivities)
                  }
                >
                  {activity}
                </div>
              ))}
            </div>
          </div>
          <div className={classes.selectedList}>
            {likedActivities.map((activity) => (
              <span key={activity} className={classes.selectedItem}>
                <span
                  style={{
                    color: "#2B7040",
                    backgroundColor: "transparent",
                  }}
                >
                  ★
                </span>{" "}
                {activity}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.heading2}>
          Which activities are an absolute no-go for you? (multiple selection)
        </h2>
        <p className={classes.paragraph}>
          Please click on all the activities that are an exclusion criteria for
          you to meet a new friend.
        </p>
        <div className={classes.dropdownContainer}>
          <div>
            <div
              className={classes.searchBar}
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "3px",
              }}
            >
              <IoMdSearch />
              <input
                className={classes.input}
                type="text"
                placeholder="Search"
                value={noGoSearchQuery}
                onChange={(e) => setNoGoSearchQuery(e.target.value)}
              />
            </div>

            <div className={classes.activityList}>
              {filteredNoGoActivities.map((activity) => (
                <div
                  key={activity}
                  className={`${classes.activityItem} ${
                    noGoActivities.includes(activity) ? classes.selected : ""
                  }`}
                  onClick={() =>
                    handleActivityClick(activity, setNoGoActivities)
                  }
                >
                  {activity}
                </div>
              ))}
            </div>
          </div>
          <div className={classes.selectedList}>
            {noGoActivities.map((activity) => (
              <span key={activity} className={classes.selectedItem}>
                <span
                  style={{
                    color: "#912828",
                    backgroundColor: "transparent",
                  }}
                >
                  ★
                </span>{" "}
                {activity}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <button onClick={handleSubmit} className={classes.submitButton}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickingActivityComponent;
