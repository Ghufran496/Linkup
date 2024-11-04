import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProfileInputComponent from "../../components/ProfileInput/Profileinput";
import { useUser } from "../../context/UserContext";

const ProfileInput = () => {
  const router = useRouter();
  const { userId } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = userId || sessionStorage.getItem("userId");
      const redirectAfterRegister = sessionStorage.getItem(
        "redirectAfterRegister"
      );
      if (storedUserId && redirectAfterRegister === null) {
        router.push("/userprofile");
      }else if (storedUserId ===null && redirectAfterRegister === null) {
        router.push("/");
      } 
      else if (storedUserId && redirectAfterRegister === true) {
        router.push("/profileinput");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [userId, router]);

  return <div>{isAuthenticated ? <ProfileInputComponent /> : null}</div>;
};

export default ProfileInput;
