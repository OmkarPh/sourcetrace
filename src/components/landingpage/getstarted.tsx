import React from "react";
import Getstartedtext from "./Getstartedtext";
import Getstartedimg from "./Getstartedimg"

function Getstarted() {
  return (
    <div className=" bg-white flex items-center justify-around">
      <div>
        <Getstartedtext/>
      </div>
      {/* <div className="px-32 py-5">
        <div className=" text-2xl font-bold pt-36">
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
        <div className="pt-10">
          <button className=" bg-blue-400 my-4 p-3 pl-12 pr-12 text-lg rounded-full hover:bg-blue-500 hover:text-white">
            Get Started
          </button>
        </div>
      </div> */}
      {/* <div className=" mr-14">
        <img src={main} className="max-w-xl  pt-8 pr-7"></img>
      </div> */}
      <div>
          <Getstartedimg/>
      </div>
    </div>
  );
}

export default Getstarted;
