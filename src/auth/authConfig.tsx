import * as Routes from "../constants/routes";
import { createMetamaskAuth, RoutingConfig } from "../lib/useMetamaskAuth";

export enum Roles {
  PRODUCER = "PRODUCER",
  WAREHOUSE = "WAREHOUSE",
}
export interface ProfileData {
  address: string;
  name: string;
  license: string;
  role: Roles;
}

const routingConfig: RoutingConfig = {
  onBoarding: Routes.ONBOARDING_ROUTE, 
  loggedIn: Routes.LOGGED_IN,
  newComer: Routes.NEW_COMER,
}

const {
  AuthenticatedRoute, withAuthenticatedRoute,
  ConnectedRoute, withConnectedRoute,
  MetamaskAuthProvider, useMetamaskAuth
} = createMetamaskAuth<ProfileData>(routingConfig);

export {
  AuthenticatedRoute, withAuthenticatedRoute,
  ConnectedRoute, withConnectedRoute,
  MetamaskAuthProvider, useMetamaskAuth
}