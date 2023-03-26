import { useState } from "react";
// import React, { useState} from "react";
import { TextField } from '@mui/material';
import { Button } from '@mui/material';


function WarehouseRegister(){

    const [info, setInfo] = useState({
        name: '',
        phoneno: '',
        regno: '',
        address: '',
    })

    const inputEvent = (event: any) => {
        console.log(event.target.value); 

        const value = event.target.value;
        const name = event.target.value;

        setInfo({...info, [name]: value});
        // setInfo((prev) => {
        //     // console.log(prev)
        //     return {...prev, [name]: value};
        // })
    }

    const onSubmits = (event: any) =>
    {
        event.preventDefault();
        // console.log(setInfo.name)
        // console.log(setInfo.name)
    }

    return (
        <div>
        <label className="Sourcetraceheading">Source Trace</label>
        <label className="Projecttitle">Supply chain management software</label>
        <img src='/illustrations/Warehouse.svg' className="Producer-logo" alt="Warehouselogo" />
        
        <form onSubmit={onSubmits}>
        {/* NAME */}
        <label htmlFor="name" className="Name">Name: </label>
        <TextField className="Namebox" onChange={inputEvent}  id="Name" label="Name" variant="filled" autoComplete="off"/>


        {/* Phone no */}
        <label className="Phoneno">Phone no: </label>
        <TextField className="Phonenobox" onChange={inputEvent} id="Phoneno" label="Phone no" variant="filled" autoComplete="off"/>


        {/* Registration No */}
        <label className="Regno">Registeration No: </label>
        <TextField className="Regnobox" onChange={inputEvent} id="Regno" label="Registeration No" variant="filled" autoComplete="off"/>


        {/* Address */}
        <label className="Address">Address: </label>
        <TextField className="Addressbox" onChange={inputEvent}  id="Address" label="Address" variant="filled" autoComplete="off"/>
       

        {/* Button */}
        <Button className="Confirmbtn" type="submit" variant="contained">CONFIRM</Button>
        </form>
        </div>
    )
}

export default WarehouseRegister