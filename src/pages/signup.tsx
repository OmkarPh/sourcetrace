import React from "react";
import { Button } from '@mui/material';
import { withConnectedRoute } from "../auth/authConfig";
import { useRouter } from "next/router";

function Signup(){
    const router = useRouter();
    function goTo(url: string){
        setTimeout(() => {
            router.push(url);

        }, 100);
    }
    return(<div>
        <div>
        <div className="labels">
            <label className="title">Producer </label>
            <label className="title">Warehouse</label>
        </div>
        </div>
        <div className="container">
            <div>
                <button className="card" onClick={() => goTo('/producerRegister')}>
                    <img src="/illustrations/Producercard.svg"></img>
                </button>
            </div>
        <div>
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
    )
}

export default withConnectedRoute(Signup);