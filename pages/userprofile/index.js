import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserProfileComponent from "../../components/UserProfileComponent/UserProfileComponent";
import { useUser } from "../../context/UserContext"; 

const ProfileInput = () => {
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
  }, [userId, router]);

  return (
    <div>
      {isAuthenticated ? <UserProfileComponent /> : null}
    </div>
  );
};

export default ProfileInput;
