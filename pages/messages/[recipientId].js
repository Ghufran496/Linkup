import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InboxComponent from "../../components/InboxComponent/InboxComponent";
import { useUser } from "../../context/UserContext";
import { ref, get } from "firebase/database";
import { database } from "../../lib/firebaseConfig";

const ChatWithRecipient = () => {
  const router = useRouter();
  const { userId } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [recipientInfo, setRecipientInfo] = useState({
    name: "",
    image: "",
  }); // Default image

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = userId || sessionStorage.getItem("userId");
      const recipientId = router.query.recipientId;

      if (!storedUserId || !recipientId) {
        router.push("/");
      } else {
        setIsAuthenticated(true);
        setChatId(generateChatId(storedUserId, recipientId));
        fetchRecipientInfo(recipientId);
      }
    }
  }, [userId, router.query]);

  const generateChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
  };

  // Fetch recipient information
  const fetchRecipientInfo = async (recipientId) => {
    try {
      const userRef1 = ref(database, `users/${recipientId}/inputfields`);
      const userRef2 = ref(database, `users/${recipientId}`);

      // Fetch both snapshots
      const [snapshot1, snapshot2] = await Promise.all([
        get(userRef1),
        get(userRef2),
      ]);

      // Get data from each snapshot if it exists, otherwise use default values
      const data1 = snapshot1.exists() ? snapshot1.val() : {};
      const data2 = snapshot2.exists() ? snapshot2.val() : {};

      // Set recipient info using data from both paths, with fallbacks
      console.log("ssssssss" + data2.profilepic);
      setRecipientInfo({
        name: data1.displayName || "Unknown User",
        image: data2.profilepic || "/Images/Image.png",
      });
      console.log("ssssssssccc" + recipientInfo.image, recipientInfo.name);
    } catch (error) {
      console.error("Error fetching recipient info:", error);
      setRecipientInfo({
        name: "Unknown User",
        image: "/Images/Image.png",
      });
    }
  };

  return (
    <div>
      {isAuthenticated && chatId ? (
        <InboxComponent chatId={chatId} recipientInfos={recipientInfo} />
      ) : null}
    </div>
  );
};

export default ChatWithRecipient;
