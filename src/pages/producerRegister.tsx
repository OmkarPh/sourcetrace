import { FormEvent, useEffect, useState } from "react";
// import React, { useState} from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import Loader from "../components/core/Loader";
import { useMetamaskAuth } from "../auth/authConfig";
import { useRouter } from "next/router";
import { CreateProducerFn } from "../apis/apis";
import { toast } from "react-toastify";
import { DASHBOARD } from "../constants/routes";

function ProducerRegister() {
  const { metaState, isLoggedIn, refreshAuthStatus } = useMetamaskAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [info, setInfo] = useState({
    name: "",
    phoneno: "",
    regno: "",
    location: "",
  });

  useEffect(() => {
    if(isLoggedIn)
      router.push('/dashboard');
  }, [isLoggedIn, router]);
  
  const inputEvent = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
  
    setInfo((prev)=>{
      event.preventDefault();
      return {...prev, [name]:value}
    })

  }

  const onSubmits = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log({
      entityAddress: metaState.account[0],
      ...info,
    });
    console.log(
      "Create producer params",
      metaState.account[0],
      info,
      info.name,
      info.phoneno,
      info.regno,
      info.location
    );
    
    setProcessing(true);

    CreateProducerFn(
      metaState.account[0],
      info.name,
      info.phoneno,
      info.regno,
      info.location,
      [],
      []
    ).then(res => {
      toast.success("Registered successfuly !");
      setProcessing(false);
      refreshAuthStatus();
      router.push(DASHBOARD);
    })
    .catch(err => {
      toast.error(<>Please approve metamask tx</>);
      setProcessing(false);
    })
  };

  if(processing){
    return <Loader />
  }

  return (    
    <div className="p-5">
      <label className="Projecttitle p-2 text-center p-10 ml-12">
        Register as Producer
      </label>
      <br />
      <br />
      <br />

      <div className="flex flex-row h-[calc(100vh-55px)] overflow-hidden box-borderr m-2">
        <div className="w-1/2">
          <img
            src="/illustrations/Producer.svg"
            className="Producer-logo ml-10 pb-10"
            alt="Producerlogo"
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
              name="name"
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
                  name="phoneno"
                  // label="Phone no"
                  variant="outlined"
                  autoComplete="off"
                />
              </div>

              <div className="w-1/2">
                {/* Registration No */}
                <label className="Regno w-1/2">Registeration No: </label>
                <br/>
              
                <TextField
                  className="Regnobox mt-2"
                  value={info.regno}
                  onChange={inputEvent}
                  id="Regno"
                  name="regno"
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
                value={info.location}
                onChange={inputEvent}
                id="Location"
                name="location"
                // label="Address"
                variant="outlined"
                autoComplete="off"
              />
            </div>

            <br />
            <br />
            <div className="w-100 flex flex-row center text-center justify-center items-center mt-2">
              {/* Button */}
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

export default ProducerRegister;