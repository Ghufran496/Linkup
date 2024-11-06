import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import classes from "./PickingActivity.module.css";
import { IoMdSearch } from "react-icons/io";
import { database } from "../../lib/firebaseConfig";
import { ref, set } from "firebase/database";
import { useRouter } from "next/router";
import { LuLoader } from "react-icons/lu";

const activities = [
  "Antiquing",
  "Astrology",
  "Athletics",
  "Baking",
  "Baseball",
  "Basketball",
  "Boardgames",
  "Bowling",
  "Camping",
  "Chess",
  "Climbing",
  "Cooking",
  "Dancing",
  "Escape Rooms",
  "Fishing",
  "Fitness",
  "Gardening",
  "Gaming",
  "Golf",
  "Hiking",
  "Horseback riding",
  "Karaoke",
  "Karate",
  "Painting",
  "Photography",
  "Pilates",
  "Reading",
  "Running",
  "Sailing",
  "Salsa",
  "Shopping",
  "Skiing",
  "Skydiving",
  "Snowboarding",
  "Soccer",
  "Spinning",
  "Surfing",
  "Swimming",
  "Testing Restaurants",
  "Yoga",
];

const PickingActivityComponent = () => {
  const { userId } = useUser();
  const [likedActivities, setLikedActivities] = useState([]);
  const [noGoActivities, setNoGoActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noGoSearchQuery, setNoGoSearchQuery] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const filteredActivities = activities.filter((activity) =>
    activity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNoGoActivities = activities.filter((activity) =>
    activity.toLowerCase().includes(noGoSearchQuery.toLowerCase())
  );

  const handleActivityClick = (
    activity,
    setActivities,
    otherActivities,
    maxLimit
  ) => {
    // Check if the activity is in the other list
    if (otherActivities.includes(activity)) {
      setError(
        `You cannot select the same activity for both liked and no-go lists.`
      );
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      return;
    }

    setActivities((prevActivities) => {
      if (prevActivities.includes(activity)) {
        return prevActivities.filter((a) => a !== activity);
      } else if (prevActivities.length < maxLimit) {
        return [...prevActivities, activity];
      } else {
        setError(`You can only select up to ${maxLimit} activities.`);
        setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
        return prevActivities;
      }
    });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    if (!userId) {
      alert("User ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }
    if (likedActivities.length === 0) {
      setError("Please select at least one activity you like.");
      setIsLoading(false);
      return;
    }

    const data = {
      likedActivities,
      noGoActivities,
    };

    const likedRef = ref(database, `users/${userId}/likedActivities`);
    const noGoRef = ref(database, `users/${userId}/noGoActivities`);

    set(likedRef, likedActivities)
      .then(() => set(noGoRef, noGoActivities))
      .then(() => {
        setIsLoading(false);
        sessionStorage.removeItem("redirectAfterRegister");
        router.push("/userprofile");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error saving data:", error);
        setError("Failed to save data. Please try again.");
      });
  };

  return (
    <div className={classes.container}>
      {error && <div className={classes.errorPopup}>{error}</div>}

      {/* Liked Activities Section */}
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
                    handleActivityClick(
                      activity,
                      setLikedActivities,
                      noGoActivities,
                      10
                    )
                  }
                >
                  {activity}
                </div>
              ))}
            </div>
          </div>
          <div className={classes.selectedList}>
            {likedActivities.map((activity) => (
              <span
                key={activity}
                className={classes.selectedItem}
                onClick={() =>
                  handleActivityClick(
                    activity,
                    setLikedActivities,
                    noGoActivities,
                    10
                  )
                }
              >
                ★ {activity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* No-Go Activities Section */}
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
                    handleActivityClick(
                      activity,
                      setNoGoActivities,
                      likedActivities,
                      20
                    )
                  }
                >
                  {activity}
                </div>
              ))}
            </div>
          </div>
          <div className={classes.selectedList}>
            {noGoActivities.map((activity) => (
              <span
                key={activity}
                className={classes.selectedItem}
                onClick={() =>
                  handleActivityClick(
                    activity,
                    setNoGoActivities,
                    likedActivities,
                    20
                  )
                }
              >
                ★ {activity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <button
          onClick={handleSubmit}
          className={classes.submitButton}
          disabled={likedActivities.length === 0}
        >
          {isLoading ? <LuLoader /> : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PickingActivityComponent;
