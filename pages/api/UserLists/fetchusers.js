// pages/api/userlists/fetchusers.js
import { ref, get } from "firebase/database";
import { database } from "../../../lib/firebaseAdmin";

async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    // Define the Firebase reference
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      res.status(404).json({ message: "No profiles found." });
      return;
    }

    const data = snapshot.val();

    console.log(data,"data")
    // Filter user-specific data (assuming "email" in the Firebase structure for simplicity)
    const formattedProfiles = Object.keys(data)
      .filter((userId) => data[userId].email === userEmail)
      .map((userId) => {
        const profile = data[userId].inputfields || {};
        const activities = data[userId].likedActivities || [];
        const noGoActivities = data[userId].noGoActivities || [];

        return {
          name: profile.displayName || profile.fullName || "Unknown",
          location: profile.location || "Unknown",
          age: profile.age || "N/A",
          gender: profile.gender || "N/A",
          matchedThrough: activities,
          bio: profile.about || "No bio available",
          likes: activities,
          dislikes: noGoActivities,
        };
      });

    res.status(200).json(formattedProfiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export default handler;
