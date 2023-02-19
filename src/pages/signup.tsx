import { useRouter } from 'next/router';
import React from 'react'
import withConnectedRoute from '../auth/ConnectedRoute'
import useMetamaskAuth from '../auth/useMetamaskAuth'
import { DASHBOARD } from '../constants/routes';

const Signup = () => {
  const { metaState, isProcessingLogin, refreshAuthStatus } = useMetamaskAuth();
  const router = useRouter();

  const signup = () => {
    if(metaState?.account){
      setTimeout(() => {
        localStorage.setItem(metaState.account[0], 'yes');
        refreshAuthStatus();
        router.push(DASHBOARD);
      }, 2000);
    }
  }

  if(!metaState.account.length)
    return <div>Connect wallet first :/</div>
  
  if(isProcessingLogin)
    return <div>Loading ....</div>

  return (
    <div className='p-4'>
      <h1 className="text-3xl font-bold">
        Signup page
      </h1>
      <br/>
      Enter name
      <br/>
      Enter role
      <br/>
      Account connected: { metaState.account[0] }
      <br/>
      <br/>
      <button
        type="button"
        onClick={signup}
        className="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-800 focus:ring-blue-800 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full"
      >
        Signup
      </button>
    </div>
  )
}

export default withConnectedRoute(Signup);