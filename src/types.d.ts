// types.ts

export interface Organization {
  name: string;
  network: string;
  cidr: number;
  id: string;
}

export interface Location {
  organization: string;
  name: string;
  network: string;
  cidr: number;
  id: string;
}

export interface Network {
  organization: string;
  location: string;
  name: string;
  network: string;
  cidr: number;
  id: string;
}

export interface Security {
  connections: {
    [key: string]: boolean;
  };
  isInitialized: boolean;
}

export interface AppState {
  organizations: Organization[];
  locations: Location[];
  networks: Network[];
  security: Security;
}

// Utility type for network connection keys
export type NetworkConnectionKey = `${string}-${string}`;

// You might also want to define some utility types for your actions
export type OrganizationId = string;
export type LocationId = string;
export type NetworkId = string;

export interface AddOrganizationPayload {
  name: string;
  network: string;
  cidr: number;
}

export interface AddLocationPayload {
  organization: OrganizationId;
  name: string;
  network: string;
  cidr: number;
}

export interface AddNetworkPayload {
  organization: OrganizationId;
  location: LocationId;
  name: string;
  network: string;
  cidr: number;
}

export interface ToggleConnectionPayload {
  network1Id: NetworkId;
  network2Id: NetworkId;
}

export interface RootState {
  organizations: Organization[];
  locations: Location[];
  networks: Network[];
  security: Security;
}