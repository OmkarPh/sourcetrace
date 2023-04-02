import * as Routes from "../constants/routes";
import { createMetamaskAuth, RoutingConfig } from "../lib/useMetamaskAuth";

export enum Roles {
  PRODUCER = "PRODUCER",
  WAREHOUSE = "WAREHOUSE",
}
export interface ParsedTruckDetails {
  license: string;
  address: string;
}
export interface ProfileData {
  id: string;
  name: string;
  // license: string;
  role: Roles;
  location: string;
  parsedTruckDetails: ParsedTruckDetails[];
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