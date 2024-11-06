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
    image: "/Images/inbox.png",
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
    const userRef = ref(database, `users/${recipientId}/inputfields`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      setRecipientInfo({
        name: data.displayName || "Unknown User",
        image: data.profileImage || "/Images/inbox.png", // Adjust field name if different
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
