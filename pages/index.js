import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LandingPage from "../components/LandingPage/LandingPage";
import { useUser } from "../context/UserContext";
import { LuLoader } from "react-icons/lu";

export default function Home() {
  const router = useRouter();
  const { userId } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      //setIsLoading(true);
      const storedUserId = userId || sessionStorage.getItem("userId");
      const redirectAfterRegister = sessionStorage.getItem(
        "redirectAfterRegister"
      );

      if (storedUserId && redirectAfterRegister === true) {
        router.push("/profileinput");
      } else if (storedUserId && !redirectAfterRegister) {
        router.push("/userprofile");
      }
    }
    setIsLoading(false);
  }, [userId, router]);

  return (
    <section>
      <Head>
        <title>Link Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <LuLoader />
      ) : (
        <div>
          {/* <Login /> */}
          <LandingPage></LandingPage>
        </div>
      )}
    </section>
  );
}
