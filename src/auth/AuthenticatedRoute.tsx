import { useRouter } from "next/router";
import { ComponentType, PropsWithChildren, useEffect } from "react";
import { ONLY_CONNECTED_ROUTE, NEW_COMER } from "../constants/routes";
import useMetamaskAuth from "./useMetamaskAuth";

const AuthenticatedRoute = (props: PropsWithChildren) => {
  const { isLoggedIn, isProcessingLogin, metaState: { isConnected } } = useMetamaskAuth();
  const router = useRouter();

  useEffect(() => {
    if(!isProcessingLogin){
      if(!isConnected){
        router.push(NEW_COMER);
        return;
      }
      if(!isLoggedIn){
        router.push(ONLY_CONNECTED_ROUTE);
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

export default function withAuthenticateddRoute<T>(WrappedComponent: ComponentType<PropsWithChildren<T>>){
  const HOC = (props: PropsWithChildren<T>) => (
    <AuthenticatedRoute>
      <WrappedComponent {...props} />
    </AuthenticatedRoute>
  )
  return HOC;
}