import { useRouter } from "next/router";
import { ComponentType, PropsWithChildren, useEffect } from "react";
import { GenericContextValues, RoutingConfig } from "./useMetamaskAuth";

export function generateAuthenticatedRoute(useMetamaskAuth: () => GenericContextValues, routerInfo: RoutingConfig){
  const AuthenticatedRoute = (props: PropsWithChildren) => {
    const { isLoggedIn, isProcessingLogin, metaState: { isConnected } } = useMetamaskAuth();
    const router = useRouter();
  
    useEffect(() => {
      if(!isProcessingLogin){
        if(!isConnected){
          router.push(routerInfo.newComer);
          return;
        }
        if(!isLoggedIn){
          router.push(routerInfo.onBoarding);
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
  
  function withAuthenticatedRoute<T>(WrappedComponent: ComponentType<PropsWithChildren<T>>){
    const HOC = (props: PropsWithChildren<T>) => (
      <AuthenticatedRoute>
        <WrappedComponent {...props} />
      </AuthenticatedRoute>
    )
    return HOC;
  }

  return { AuthenticatedRoute, withAuthenticatedRoute };
}