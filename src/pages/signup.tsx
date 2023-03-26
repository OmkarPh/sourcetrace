import React from "react";
import { Button } from '@mui/material';
import { withConnectedRoute } from "../auth/authConfig";

function Signup(){
    return(<div>
        <div>
        <div className="labels">
            <label className="title">Warehouse</label>
            <label className="title">Producer </label>
        </div>
        </div>
        <div className="container">
            <div>
                <button className="card">
                    <img src="/illustrations/Producercard.svg"></img>
                </button>
            </div>
        <div>
            <button className="card">
                <img src="/illustrations/Warehousecard.svg"></img>
            </button>
        </div>
    
        </div>
        <div className="PlaceBtn">
          {/* Button */}
            <Button
                className="Confirmbtn2"
                type="submit"
                variant="contained"
                >
                CONFIRM
              </Button>
            </div>
    </div>
    )
}

export default withConnectedRoute(Signup);