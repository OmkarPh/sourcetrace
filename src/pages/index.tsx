import { useMetamaskAuth } from "../auth/authConfig";
import Component2 from "../components/landing/Component-2";
import Footer from "../components/landing/Footer";
import Mid_component from "../components/landing/Mid-Component";
import Content from "../components/landing/Page_Content";

export default function Home() {
  const { connect } = useMetamaskAuth();

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">
          Landing page
        </h1>
        
        <Content/>
        <Mid_component/>
        <Component2/>
        <Footer/>
      </div>
    </>
  )
}
