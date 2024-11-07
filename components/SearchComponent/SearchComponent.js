import React, { useState, useEffect } from "react";
import classes from "./SearchComponent.module.css";
import { useRouter } from "next/router";
import { ref, get } from "firebase/database";
import { database } from "../../lib/firebaseConfig";
import { useUser } from "../../context/UserContext";
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

const SearchComponent = () => {
  const router = useRouter();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [activitySearch, setActivitySearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [genderSearch, setGenderSearch] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const { userId } = useUser();

  useEffect(() => {
    const fetchProfiles = async () => {
      const usersRef = ref(database, "users");
      try {
        setIsLoginLoading(true);
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedProfiles = Object.keys(data).map((userId) => ({
            userId,
            name:
              data[userId].inputfields.displayName ||
              data[userId].inputfields.fullName ||
              "Unknown",
            location: data[userId].inputfields.location || "Unknown",
            age: data[userId].inputfields.age || "N/A",
            gender: data[userId].inputfields.gender || "N/A",
            bio: data[userId].inputfields.about || "No bio available",
            matchedThrough: data[userId].likedActivities || [],
            likes: data[userId].likedActivities || [],
            dislikes: data[userId].noGoActivities || [],
            image: data[userId].inputfields.profileImage || "/Images/image.png",
          }));
          setProfiles(formattedProfiles);
          setFilteredProfiles(formattedProfiles); // Initialize with all profiles
        }
        setIsLoginLoading(false);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  const handleSearch = () => {
    const result = profiles.filter((profile) => {
      const isNotCurrentUser = profile.userId !== userId;
      const activityMatch =
        activitySearch === "" ||
        profile.matchedThrough.includes(activitySearch);
      const nameMatch =
        nameSearch === "" ||
        profile.name.toLowerCase().includes(nameSearch.toLowerCase());
      const genderMatch =
        genderSearch === "" || profile.gender === genderSearch;
      return isNotCurrentUser && activityMatch && nameMatch && genderMatch;
    });
    setFilteredProfiles(result);
  };

  const messageButton = (profileUserId) => {
    router.push(`/messages/${profileUserId}`);
  };

  return (
    <div className={classes.container}>
      {/* Filter Section */}
      <div className={classes.filters}>
        <div className={classes.filter}>
          <label>Activity</label>
          <select
            className={classes.inputField}
            value={activitySearch}
            onChange={(e) => setActivitySearch(e.target.value)}
          >
            <option value="">Select Activity</option>
            {activities.map((activity, index) => (
              <option key={index} value={activity}>
                {activity}
              </option>
            ))}
          </select>
        </div>
        <div className={classes.filter}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Search names..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </div>
        <div className={classes.filter}>
          <label>Gender</label>
          <select
            className={classes.inputField}
            value={genderSearch}
            onChange={(e) => setGenderSearch(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button onClick={handleSearch} className={classes.searchButton}>
          Search
        </button>
      </div>

      {/* Profiles List */}
      {isLoginLoading ? (
        <div className={classes.loader}>
          <LuLoader style={{ width: "50px", height: "50px" }} />
        </div>
      ) : (
        <div className={classes.profiles}>
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile, index) => (
              <div key={index} className={classes.profileCard}>
                <img
                  src={profile.image}
                  alt="Profile"
                  className={classes.profileImage}
                  onClick={() => setSelectedProfile(profile)}
                />
                <div className={classes.profileInfo}>
                  <h3>{profile.name}</h3>
                  <p>
                    <span role="img" aria-label="location">
                      📍
                    </span>{" "}
                    {profile.location}
                  </p>
                  <p>
                    <b>Matched through:</b>{" "}
                    {profile.matchedThrough.map((activity, idx) => (
                      <span key={idx} className={classes.tag}>
                        {activity}
                      </span>
                    ))}
                  </p>
                  <p>
                    <b>Age {profile.age}</b>
                  </p>
                  <p>
                    <b>{profile.gender}</b>
                  </p>
                  <p className={classes.bio}>{profile.bio}</p>
                </div>
                <button
                  onClick={() => messageButton(profile.userId)}
                  className={classes.scheduleButton}
                >
                  Message
                </button>
              </div>
            ))
          ) : (
            <p>No profiles match your search criteria.</p>
          )}
        </div>
      )}

      {/* Profile Modal */}
      {selectedProfile && (
        <div
          className={classes.modalOverlay}
          onClick={() => setSelectedProfile(null)}
        >
          <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
            <div className={classes.modalHeader}>
              <img
                src={selectedProfile.image}
                alt="Profile"
                className={classes.modalProfileImage}
              />
              <h3>{selectedProfile.name}</h3>
              <p>
                Age {selectedProfile.age} • {selectedProfile.gender} •{" "}
                <span role="img" aria-label="location">
                  📍
                </span>{" "}
                {selectedProfile.location}
              </p>
            </div>
            <div className={classes.modalContent}>
              <h4>About me</h4>
              <p>{selectedProfile.bio}</p>
              <h4>Likes</h4>
              <div className={classes.tags}>
                {selectedProfile.likes.map((like, idx) => (
                  <span key={idx} className={classes.tagLike}>
                    {like}
                  </span>
                ))}
              </div>
              <h4>Dislikes</h4>
              <div className={classes.tags}>
                {selectedProfile.dislikes.map((dislike, idx) => (
                  <span key={idx} className={classes.tagDislike}>
                    {dislike}
                  </span>
                ))}
              </div>
            </div>
            <button
              className={classes.closeButton}
              onClick={() => setSelectedProfile(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
