import Head from "next/head";
import React, { useState } from "react";
import { useMetamaskAuth } from "../auth/authConfig";
import Loader from "../components/core/Loader";
import AccountInfo from "../components/Dasboard/AccountInfo";
import ProductList from "../components/Dasboard/ProductList";
import GMap from "./gmap";
import { Container, LeftContainer, RightContainer } from "./styled/dashboard.styled";

const locations = [
  { lat: 37.7749, lng: -122.4194 }, // San Francisco, CA
  { lat: 40.7128, lng: -74.0060 }, // New York, NY
  { lat: 51.5074, lng: -0.1278 }, // London, UK
];

enum SECTIONS {
  PRODUCTS="PRODUCTS",
  LOTS="LOTS"
}
const Dashboard = () => {
  const { isLoggedIn, isProcessingLogin, profile, refreshAuthStatus } = useMetamaskAuth();
  const [selectedSection, setSelectedSection] = useState<SECTIONS>(SECTIONS.PRODUCTS);

  function deleteAccount(){
    if(profile)
      localStorage.removeItem(profile.address);
    refreshAuthStatus();
  }
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
                          `w-[100px] p-1 rounded-md text-center ${isSelected ? "bg-[#73f3fe] transition-colors duration-200 ease-in-out "
                          : "text-gray-800 hover:bg-[#cff8fb]"}`
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
                          <ProductList />
                  }
              </div>
            </div>
          </RightContainer>
        </Container>
        </div>
      <div>

        {isProcessingLogin ? (
          <>Loading ....</>
        ) : (
          isLoggedIn &&
          profile && (
            <div>
              Logged in as {profile.name} <br />
              Role: {profile.role} <br/>
              @ {profile.address}

              <br/>
              <br/>
              <br/>
              <button className="bg-red-500 py-[8px] px-[24px] rounded-lg text-white" onClick={deleteAccount}>
                Delete my account
              </button>
            </div>
          )
        )}
        {/* <GMap locations={locations} /> */}
      </div>
    </div>
  );
};

export default (Dashboard);
// export default withAuthenticatedRoute(Dashboard);