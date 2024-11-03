import Head from "next/head";
import React from "react";
import Login from "../components/RegistrationPage/Login";
export default function Home() {
  return (
    <section>
      <Head>
        <title>Link Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Login></Login>
      </div>
    </section>
  );
}
