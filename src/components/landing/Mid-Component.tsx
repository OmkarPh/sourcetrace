import React from "react";

function Mid_component() {
  return (
    <div>
      <div className="mid-contianer">
        <div className="left-mid-div">
          <div id="img-1">
            <img src="/images/landing/prod.png"></img>
            <h1>Produer{"'"}s Role</h1>
          </div>
        </div>
        <div className="right-mid-div">
          Producers may submit product information to the blockchain, which will
          be accessible to the Warehouse.<br></br>
          With Source Trace, producers can improve transparency, enhance
          accountability, and streamline their operations by tracking the
          history of their products and updating it to the blockchain.
        </div>
      </div>
    </div>
  );
}
export default Mid_component;
