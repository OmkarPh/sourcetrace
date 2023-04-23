import React from "react";

function Warehouserole(){
    return <div className=" bg-slate-100 flex items-center justify-around">
        <div className="w-1/3 font-bold">
        <span className="text-2xl font-bold">Warehouse</span>
        <br/>
        <br/>
            Warehouse needs to update the product details on the blockchain at the time of the product&apos;s departure. 
            And also when the product arrives at the warehouse.  
        </div>
        <div>
            <img src="./illustrations/Warehouserole.png" alt="warehouse" className="w-60"></img>
        </div>
    </div>
}

export default Warehouserole