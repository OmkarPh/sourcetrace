import Head from "next/head";
import React from "react";
import { useMetamaskAuth } from "../auth/authConfig";

const Dashboard = () => {
  const { isLoggedIn, isProcessingLogin, profile, refreshAuthStatus } = useMetamaskAuth();

  function deleteAccount(){
    if(profile)
      localStorage.removeItem(profile.address);
    refreshAuthStatus();
  }

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

              <br/>
              <br/>
              <br/>
              <button className="bg-red-500 py-[8px] px-[24px] rounded-lg text-white" onClick={deleteAccount}>
                Delete my account
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default (Dashboard);
