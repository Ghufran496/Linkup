import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "../../context/UserContext";
import InboxComponent from "../../components/InboxComponent/InboxComponent";
const Inbox = () => {
  const router = useRouter();
  const { userId } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = userId || sessionStorage.getItem("userId");

      if (!storedUserId) {
        router.push("/"); 
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [userId]);

  return <div>{isAuthenticated ? <InboxComponent /> : null}</div>;
};

export default Inbox;

