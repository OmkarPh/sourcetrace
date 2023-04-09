import React from "react";
import { Button } from "@mui/material";
import { withConnectedRoute } from "../auth/authConfig";
import { useRouter } from "next/router";

function Signup() {
  const router = useRouter();
  function goTo(url: string) {
    setTimeout(() => {
      router.push(url);
    }, 100);
  }
  return (
    <div>
      <div className="signupContainer">
        <div className="leftSignupEntity">
          <div className="labels">Producer</div>
          <button className="card" onClick={() => goTo('/producerRegister')}>
            <img src="/illustrations/Producercard.svg"></img>
          </button>
        </div>
        <div className="rightSignupEntity">
          <div className="labels">Warehouse</div>
          <button className="card" onClick={() => goTo('/warehouseRegister')}>
            <img src="/illustrations/Warehousecard.svg"></img>
          </button>
        </div>
      </div>
      {/* <div className="PlaceBtn">
            <Button
                className="Confirmbtn2"
                type="submit"
                variant="contained"
                >
                CONFIRM
            </Button>
        </div> */}
    </div>
  );
}

export default withConnectedRoute(Signup);
