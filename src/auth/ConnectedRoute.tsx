import { useRouter } from "next/router";
import { Component, ComponentProps, ComponentType, PropsWithChildren, ReactComponentElement, useEffect } from "react";
import { LOGGED_IN, NEW_COMER } from "../constants/routes";
import useMetamaskAuth from "./useMetamaskAuth";

const ConnectedRoute = (props: PropsWithChildren) => {
  const { isLoggedIn, isProcessingLogin, metaState: { isConnected } } = useMetamaskAuth();
  const router = useRouter();

  useEffect(() => {
    if(!isProcessingLogin){
      if(isLoggedIn){
        router.push(LOGGED_IN);
        return;
      }
      if(!isConnected){
        router.push(NEW_COMER);
        return;
      }
    }
  }, [isLoggedIn, isConnected, isProcessingLogin, router])
  

  return (
    <>
      { props.children }
    </>
  )
}

export default function withConnectedRoute<T>(WrappedComponent: ComponentType<PropsWithChildren<T>>){
  const HOC = (props: PropsWithChildren<T>) => (
    <ConnectedRoute>
      <WrappedComponent {...props} />
    </ConnectedRoute>
  )
  return HOC;
}