import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { useMetamaskAuth } from '../../auth/authConfig'
import { ONBOARDING_ROUTE } from '../../constants/routes';

const Navbar = () => {
  const { connect, isLoggedIn, metaState, isProcessingLogin } = useMetamaskAuth();
  const router = useRouter();

  return (
    <div className='flex p-1 text-center w-screen text-lg'>
      <span className='w-4'></span>
      <Link href='/'>Home</Link>
      <span className='w-4'></span>
      <Link href='/dashboard'>/dashboard</Link>
      <span className='w-4'></span>
      <Link href='/signup'>/signup</Link>
      <span className='w-4'></span>
      {
        isProcessingLogin ?
        <></>
        :
        isLoggedIn ?
        <>
          <Link href='/dashboard'>Dashboard</Link>
          <span className='w-4'></span>
        </>
        :
        metaState.isConnected ?
        <>
          <button
            type="button"
            onClick={() => router.push(ONBOARDING_ROUTE)}
            className="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-800 focus:ring-blue-800 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full h-8"
          >
            <svg
              width="20"
              height="20"
              className="mr-2"
              fill="currentColor"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z"></path>
            </svg>
            Complete registration
          </button>
        </>
        :
        <button
          type="button"
          onClick={connect}
          className="py-2 px-4 flex justify-center items-center  bg-green-500 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full h-8"
        >
          <svg
            width="20"
            height="20"
            className="mr-2"
            fill="currentColor"
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z"></path>
          </svg>
          Connect
        </button>
      }
      <br/>
      <br/>
      </div>
  )
}

export default Navbar