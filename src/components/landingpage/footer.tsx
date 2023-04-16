import React from "react";

function Footer(){
    return <div className=" bg-slate-300 flex justify-around h-32 items-center ">
        <span className="text-2xl font-bold">Why Sourcetrace?</span>
            <div className="flex justify-end">
                <div className="flex">
                <div className="flex items-center justify-center  ml-10">
                    <span className="text-xl font-semibold mr-4">Trustworthy data</span>
                    <img src="./illustrations/trust.png" className="w-10"></img>
                </div>
                <div className="flex items-center justify-evenly ml-10">
                    <span className=" text-xl font-semibold mr-4">User friendly UI</span>
                    <img src="./illustrations/ui.png" className="w-10"></img>
                </div>
                <div className="flex items-center justify-evenly ml-10">
                    <span className="text-xl font-semibold mr-4">History of Product on your Fingrertips</span>
                    <img src="./illustrations/scan.png" className="w-10"></img>
                </div>
                </div>
        </div>
    </div>
}

export default Footer