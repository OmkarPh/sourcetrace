import React from "react";

function Producerrole(){
    return <div className=" bg-slate-100 flex items-center justify-around pt-12 ">
        <div className="flex-col">
            <img src="./illustrations/Producerrole.png" className=" w-60"></img>
            {/* <span className="font-bold">Producer Role</span> */}
          
        </div>
        <div className="w-1/3 font-bold">
        <span className="text-2xl font-bold">Producer Role</span>
        <br/>
        <br/>
            Producers may submit product information to the blockchain, which will be accessible to the Warehouse. 
        </div>
        
    </div>
}

export default Producerrole