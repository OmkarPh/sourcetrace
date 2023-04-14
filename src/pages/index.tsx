// import { useMetamaskAuth } from "../auth/authConfig";
import Getstarted from "@/components/landingpage/getstarted";
import Producerrole from "@/components/landingpage/producerrole";
import Warehouserole from "@/components/landingpage/warehouserole";
import Footer from "@/components/landingpage/footer";


export default function Home() {
  // const { connect } = useMetamaskAuth();

  return (
    <>
      <Getstarted/>
      <Producerrole/>
      <Warehouserole/>
      <Footer/>

      {/* <div>
        <h1 className="text-3xl font-bold">
          Landing page
        </h1>
        <button onClick={connect}>
          Get started
        </button>
      </div> */}
    </>
  )
}
