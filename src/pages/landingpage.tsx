import React from "react";
// import { Button } from '@mui/material';
import Getstarted from "@/components/landingpage/getstarted";
import Producerrole from "@/components/landingpage/producerrole";
import Warehouserole from "@/components/landingpage/warehouserole";
import Footer from "@/components/landingpage/footer";

function landingpage(){

    return(<div>
        <Getstarted/>
        <Producerrole/>
        <Warehouserole/>
        <Footer/>
    </div>
    )
}

export default landingpage;
