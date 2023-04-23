import React from "react";

function Retailerrole(){
    return <div className=" bg-slate-100 flex items-center justify-around pt-0 pb-6">
        <div className="flex-col">
            <img src="./illustrations/Retailerrole.png" alt="retailer" className="w-60"></img>
            {/* <span className="font-bold">Producer Role</span> */}
          
        </div>
        <div className="w-1/3 font-bold">
        <span className="text-2xl font-bold">Retailer</span>
        <br/>
        <br/>
            Retailer checks in product lots & log the entry on blockchain or reject the product if it doesn&apos;t meet set standards.
        </div>
    </div>
}

export default Retailerrole