import React, { FormEvent, useState } from "react";
import { Roles, useMetamaskAuth } from "../../auth/authConfig";
import { Button, FormControl, FormGroup, TextField } from "@mui/material";
import CustomModal, {
  CustomModalFooter,
  CustomModalHeader,
} from "./Producer/CustomModal";
import { AddTruck } from "../../apis/apis";
import { toast } from "react-toastify";
import Loader from "../core/Loader";

const TruckData = () => {
  const { profile, refreshAuthStatus } = useMetamaskAuth();
  const [isAddTruckModalOpen, setIsAddTruckModalOpen] = useState(false);
  const [addingTruck, setAddingTruck] = useState(false);

  function submit(e: FormEvent) {
    console.log("Add truck");
    e.preventDefault();
    e.stopPropagation();

    if (!profile) return;
    const target: any = e.target;
    const truckLicense = target.license.value;
    const truckAddress = target.address.value;
    const role = profile.role === Roles.PRODUCER ? 0 : 1;

    function closeModal() {
      setIsAddTruckModalOpen(false);
      setAddingTruck(false);
    }
    console.log("Add truck with params", {
      truckLicense,
      truckAddress,
      role,
    });
    setAddingTruck(true);
    AddTruck(profile.id, truckAddress, truckLicense, role)
      .then((receipt) => {
        closeModal();
        toast.success("Added truck !");
        console.log("Receipt", receipt);
        refreshAuthStatus();
        setAddingTruck(false);
      })
      .catch((err) => {
        toast.error(<>Please approve metamask tx</>);
        console.log("Some err adding truck", err);
        setAddingTruck(false);
      });
  }

  if (!profile) {
    return <></>;
  }

  const { parsedTruckDetails } = profile;

  return (
    <div>
      <div className="mt-8">
        <div className="flex flex-row center text-xl justify-between">
          <span className="py-3">Trucks</span>
          <Button
            variant="text"
            onClick={() => setIsAddTruckModalOpen(true)}
            className="ml-auto right-0"
          >
            Add truck <span className="pl-3 text-2xl">+</span>
          </Button>
        </div>
        {!parsedTruckDetails.length ? (
          <div>No trucks</div>
        ) : (
          <ul>
            {parsedTruckDetails.map((truck) => {
              return <li key={truck.address}>{truck.license}</li>;
            })}
          </ul>
        )}
      </div>

      {isAddTruckModalOpen && (
        <CustomModal isOpen onClose={() => setIsAddTruckModalOpen(false)}>
          {addingTruck ? (
            <>
              <Loader size={30} />
            </>
          ) : (
            <form onSubmit={submit}>
              {/* <CustomModalHeader>New truck</CustomModalHeader> */}
              <div className="p-4">
                New truck details:
                <br />
                <FormControl>
                  <TextField
                    required
                    name="license"
                    type="text"
                    variant="outlined"
                    label="License"
                    autoComplete="nope"
                    className="m-2"
                    style={{ marginTop: 25 }}
                  />
                </FormControl>
                <br />
                <FormControl>
                  <TextField
                    required
                    name="address"
                    type="text"
                    variant="outlined"
                    label="Truck Address"
                    autoComplete="nope"
                    className="m-2"
                    style={{ marginTop: 25 }}
                  />
                </FormControl>
              </div>
              <CustomModalFooter>
                <FormControl>
                  <Button type="submit" variant="outlined">
                    Add +
                  </Button>
                </FormControl>
              </CustomModalFooter>
            </form>
          )}
        </CustomModal>
      )}
    </div>
  );
};

export default TruckData;
