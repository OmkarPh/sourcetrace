import { useMetamaskAuth } from "../auth/authConfig";

export default function Home() {
  const { isLoggedIn, isProcessingLogin, metaState, profile, connect } = useMetamaskAuth();

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">
          Landing page
        </h1>
        <button onClick={connect}>
          Get started
        </button>
      </div>
    </>
  )
}
