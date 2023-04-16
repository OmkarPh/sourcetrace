import React from "react";
import { useMetamaskAuth } from "src/auth/authConfig";



function Getstartedtext(){
  const { connect } = useMetamaskAuth();
    return <div className="px-32 py-5">
        <div className=" text-2xl font-bold pt-16">
          Take control of your supply chain with Sourcetrace -
          <br />
          the innovative blockchain-based trackingsoftware that
          deliverstransparency and security at every step
        </div>
        <div className=" pt-1 text-xl font-thin w-1/2">
          Access it from anywhere and anytime.
          <br />
          Trusted byGovernment authorities
        </div>
        <div className="pt-12">
          <button onClick={connect} className=" bg-blue-400 my-4 p-3 pl-12 pr-12 text-lg rounded-full hover:bg-blue-500 hover:text-white">
            Get Started
          </button>
        </div>
    </div>
}

export default Getstartedtext