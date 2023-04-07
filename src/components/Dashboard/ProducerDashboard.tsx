import { Button } from "@mui/material";
import Head from "next/head";
import React, { useState } from "react";
import { Roles, useMetamaskAuth } from "../../auth/authConfig";
import Loader from "../core/Loader";
import AccountInfo from "./AccountInfo";
import ProductList from "./Producer/ProductList";
import { Container, LeftContainer, RightContainer } from "./dashboard.styled";
import NewProductModal from "./Producer/NewProductModal";
import ProductLotList from "./Producer/ProductLotList";

const locations = [
  { lat: 37.7749, lng: -122.4194 }, // San Francisco, CA
  { lat: 40.7128, lng: -74.0060 }, // New York, NY
  { lat: 51.5074, lng: -0.1278 }, // London, UK
];

enum SECTIONS {
  PRODUCTS="PRODUCTS",
  LOTS="LOTS"
}
const ProducerDashboard = () => {
  const { isProcessingLogin, profile, refreshAuthStatus } = useMetamaskAuth();
  const [selectedSection, setSelectedSection] = useState<SECTIONS>(SECTIONS.PRODUCTS);
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  console.log(profile);
  
  if(isProcessingLogin){
    return <Loader />
  }

  return (
    <div className="px-4">
    <Head>
        <title>Dashboard</title>
      </Head>
      {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}
      <br/>
      <div className="flex flex-row h-[calc(100vh-55px)] overflow-hidden box-borderr">
        <Container>
          <LeftContainer>
            <AccountInfo />
            <Button variant="contained" onClick={() => setShowNewProductModal(true)}>
              New product <span className="pl-3 text-2xl">+</span>
            </Button>
          </LeftContainer>
          <RightContainer>
            <div className="w-[100%] h-[100%] overflow-hidden">
              <div className="flex flex-row bg-[#fafeff] w-fit self-center m-auto rounded-md cursor-pointer ">
                {
                  [
                    { name: "Products", id: SECTIONS.PRODUCTS },
                    { name: "Lots", id: SECTIONS.LOTS },
                  ].map(section => {
                    const isSelected = selectedSection === section.id;
                    return (
                      <div
                        className={
                          `w-[100px] p-1 text-center ${isSelected ? "bg-[#1876d2]  text-white transition-colors duration-200 ease-in-out "
                          : "text-gray-800 hover:bg-[#c9e2fa]"}`
                        }
                        key={section.id}
                        onClick={() => setSelectedSection(section.id)}
                      >
                          { section.name }
                      </div>
                    )
                  })
                }
              </div>
              <div className="w-[100%] h-auto max-h-[calc(100vh-199px)] rounded-xl overflow-auto">
                  {
                      selectedSection == SECTIONS.PRODUCTS ?
                          <ProductList />
                      :
                          <ProductLotList />
                  }
              </div>
            </div>
          </RightContainer>
        </Container>
        </div>
      <div>
        <NewProductModal
          show={showNewProductModal}
          closeModal={() => setShowNewProductModal(false)}
        />
        {/* 
        {isProcessingLogin ? (
          <>Loading ....</>
        ) : (
          isLoggedIn &&
          profile && (
            <div>
              Logged in as {profile.name} <br />
              Role: {profile.role} <br/>
              @ {profile.id}

              <br/>
              <br/>
              <br/>
              <button className="bg-red-500 py-[8px] px-[24px] rounded-lg text-white" onClick={deleteAccount}>
                Delete my account
              </button>
            </div>
          )
        )} */}
        {/* <GMap locations={locations} /> */}
      </div>
    </div>
  );
};

export default (ProducerDashboard);
// export default withAuthenticatedRoute(ProducerDashboard);