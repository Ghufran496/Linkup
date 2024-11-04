import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PickingActivityComponent from "../../components/PickingActivity/PickingActivity";
import { useUser } from "../../context/UserContext"; 

const Activities = () => {
  const router = useRouter();
  const { userId } = useUser(); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = userId || sessionStorage.getItem("userId");

      const redirectAfterRegister = sessionStorage.getItem(
        "redirectAfterRegister"
      );
      console.log("storedUserId::",storedUserId,redirectAfterRegister, "redirectAfterRegister");
      if (storedUserId && redirectAfterRegister === null) {
        router.push("/userprofile");
      }else if (storedUserId ===null && redirectAfterRegister === null) {
        router.push("/");
      } 
      else if (storedUserId && redirectAfterRegister === true) {
        router.push("/profileinput");
      }  else {
        setIsAuthenticated(true); 
      }
    }
  }, [userId, router]);

  return (
    <div>
      {isAuthenticated ? <PickingActivityComponent /> : null}
    </div>
  );
};

export default Activities;
