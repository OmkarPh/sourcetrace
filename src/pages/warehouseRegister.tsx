import { FormEvent, useState } from "react";
// import React, { useState} from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

function WarehouseRegister() {

  const [info, setInfo] = useState({
    name: "",
    phoneno: "",
    regno: "",
    address: "",
  });

  const inputEvent = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
  
    setInfo((prev)=>{
      event.preventDefault();
      return {...prev, [name]:value}
    })

  }

  const onSubmits = (event: any) => {
    event.preventDefault();
    console.log(info);
    
  };

  return (
    
    <div className="p-5">
      <label className="Projecttitle p-2 text-center p-10 ml-12">
        Register as Warehouse
      </label>
      <br />
      <br />
      <br />

      <div className="flex flex-row h-[calc(100vh-55px)] overflow-hidden box-borderr m-2">
        <div className="w-1/2">
          <img
            src="/illustrations/Warehouse.svg"
            className="Producer-logo ml-10 pb-10"
            alt="Warehouse illustration"
          />
        </div>
        <div className="w-1/2">
          <form onSubmit={onSubmits}>
            <div>
              {/* NAME */}
              <label className="Name">Name: </label>
              <TextField
                className="Namebox mt-11"
                onChange={inputEvent}
                id="Name"
                // label="Name"
                variant="outlined"
                autoComplete="off"
              />
            </div>
            <br />

            <div className="flex flex-row overflow-hidden box-borderr m-2">
              {/* Phone no */}
              <div className="w-1/2">
                <label className="Phoneno">Phone no: </label>
                <TextField
                  className="Phonenobox mt-2"
                  onChange={inputEvent}
                  id="Phoneno"
                  // label="Phone no"
                  variant="outlined"
                  autoComplete="off"
                />
              </div>

              <div className="w-1/2">
                {/* Registration No */}
                <label className="Regno w-1/2">Registeration No: </label>
                <br />

                <TextField
                  className="Regnobox mt-2"
                  value={info.regno}
                  onChange={inputEvent}
                  id="Regno"
                  // label="Registeration No"
                  variant="outlined"
                  autoComplete="off"
                />
              </div>
            </div>
            <br />

            <div>
              {/* Address */}
              <label className="Address">Address: </label>
              <br />
              <TextField
                className="Addressbox mt-2"
                value={info.address}
                onChange={inputEvent}
                id="Address"
                // label="Address"
                variant="outlined"
                autoComplete="off"
              />
            </div>

            <br />
            <br />
            <div className="w-100 flex flex-row center text-center justify-center items-center mt-2">
              <Button
                className="Confirmbtn self-center"
                type="submit"
                variant="contained"
              >
                CONFIRM
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WarehouseRegister;
