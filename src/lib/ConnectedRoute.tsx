import { useRouter } from "next/router";
import { ComponentType, PropsWithChildren, useEffect } from "react";
import { GenericContextValues, RoutingConfig } from "./useMetamaskAuth";

export function generateConnectedRoute(useMetamaskAuth: () => GenericContextValues, routerInfo: RoutingConfig){
  const ConnectedRoute = (props: PropsWithChildren) => {
    const { isLoggedIn, isProcessingLogin, metaState: { isConnected } } = useMetamaskAuth();
    const router = useRouter();

    useEffect(() => {
      if(!isProcessingLogin){
        if(isLoggedIn){
          router.push(routerInfo.loggedIn);
          return;
        }
        if(!isConnected){
          router.push(routerInfo.newComer);
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

  function withConnectedRoute<T>(WrappedComponent: ComponentType<PropsWithChildren<T>>){
    const HOC = (props: PropsWithChildren<T>) => (
      <ConnectedRoute>
        <WrappedComponent {...props} />
      </ConnectedRoute>
    )
    return HOC;
  }

  return { ConnectedRoute, withConnectedRoute };
}