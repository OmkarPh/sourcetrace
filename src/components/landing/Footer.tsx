import React from "react";

function Footer() {
  const newLocal = "footer-img";
  return (
    <div className="rectangle">
      <div id="Footer-main">
        <div className="footer-rectangle">
          <div className="div-1">
            <p id="info">Why SourceTrace?</p>
          </div>
          <div className="div-2 ">
            <div id="div-2-trust">
              <img id="footer-img" src="/images/landing/scan.png"></img>

              <div id="content-ui">Trustworthy data</div>
            </div>

            <div id="img-2">
              <img id={newLocal} src="/images/landing/ui.png" alt="Ui Logo"></img>
              <div id="div-3-ui">User friendly UI</div>
            </div>
          </div>
          <div className="div-3">
            <div id="img-3">
              <img id="footer-img" src="trust.png"></img>
            </div>
            <div id="div-2-ui">History of Product on your Fingrertips</div>

            <div className="div-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Footer;
