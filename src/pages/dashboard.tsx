import Head from "next/head";
import React from "react";
import withAuthenticateddRoute from "../auth/AuthenticatedRoute";
import useMetamaskAuth from "../auth/useMetamaskAuth";

const Dashboard = () => {
  const { isLoggedIn, isProcessingLogin, profile } = useMetamaskAuth();

  return (
    <div className="p-4">
      <Head>
        <title>Dashboard</title>
      </Head>
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {isProcessingLogin ? (
          <>Loading ....</>
        ) : (
          isLoggedIn &&
          profile && (
            <div>
              Logged in as {profile.name} <br />
              Role: {profile.role} <br/>
              @ {profile.address}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default withAuthenticateddRoute(Dashboard);
