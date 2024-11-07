import React from "react";
import classes from "./LandingPage.module.css";
import { useRouter } from "next/router";
// Replace with the actual image path
const LandingPage = () => {
  const router = useRouter();

  const routering = () => {
    router.push("/loginpage");
  };
  return (
    <div className={classes.landingPageContainer}>
      <img
        src="/Images/logo.png"
        alt="Coffee Icon"
        className={classes.landingPageIcon}
      />
      <button className={classes.landingPageButton} onClick={routering}>
        Let’s start!
      </button>
    </div>
  );
};
export default LandingPage;
