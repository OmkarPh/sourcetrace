import React from "react";

function Content() {
  return (
    <div>
      <div className="container">
        <div className="left-div">
          <h3>
            Take control of your supply chain with Sourcetrace - the innovative
            blockchain-based tracking software that deliverstransparency and
            security at every step
          </h3>
          <div id="mid-text">
            Access it from anywhere and anytime. <br></br>Trusted by Government
            authorities and by users{" "}
          </div>
          <div id="getstart-btn">
            <button type="button">Get Started</button>
          </div>
        </div>
        <div id="right-div-content">
          <div id="img-transit">
            <img src="/images/landing/transit.png" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
