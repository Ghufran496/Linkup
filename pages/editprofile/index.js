import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditProfileComponent from "../../components/EditProfile/EditProfileComponent";
import { useUser } from "../../context/UserContext";

const EditProfile = () => {
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

  return <div>{isAuthenticated ? <EditProfileComponent /> : null}</div>;
};
export default EditProfile;
