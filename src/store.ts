import { configureStore, createSlice } from '@reduxjs/toolkit'

// Create a slice for organizations
const organizationsSlice = createSlice({
  name: 'organizations',
  initialState: [],
  reducers: {
    addOrganization: (state, action) => {
      state.push({
        ...action.payload,
        id: Date.now().toString() // Simple way to generate unique IDs
      })
    },
    updateOrganization: (state, action) => {
      const { id, ...updates } = action.payload
      const organization = state.find(org => org.id === id)
      if (organization) {
        Object.assign(organization, updates)
      }
    },
    deleteOrganization: (state, action) => {
      const index = state.findIndex(org => org.id === action.payload)
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
    setOrganizations: (_state, action) => {
      return action.payload;
    },
  }
})
// Export action creators
export const { addOrganization, updateOrganization, deleteOrganization, setOrganizations } = organizationsSlice.actions

// Create a slice for locations
const locationsSlice = createSlice({
  name: 'locations',
  initialState: [],
  reducers: {
    addLocation: (state, action) => {
      state.push({
        ...action.payload,
        id: Date.now().toString() // Simple way to generate unique IDs
      })
    },
    updateLocation: (state, action) => {
      const { id, ...updates } = action.payload
      const location = state.find(loc => loc.id === id)
      if (location) {
        Object.assign(location, updates)
      }
    },
    deleteLocation: (state, action) => {
      const index = state.findIndex(loc => loc.id === action.payload)
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
    setLocations: (_state, action) => {
      return action.payload;
    },
  }
})
// Export action creators
export const { addLocation, updateLocation, deleteLocation, setLocations } = locationsSlice.actions

// Create a slice for networks
const networkSlice = createSlice({
  name: 'locations',
  initialState: [],
  reducers: {
    addNetwork: (state, action) => {
      state.push({
        ...action.payload,
        id: Date.now().toString() // Simple way to generate unique IDs
      })
    },
    updateNetwork: (state, action) => {
      const { id, ...updates } = action.payload
      const location = state.find(loc => loc.id === id)
      if (location) {
        Object.assign(location, updates)
      }
    },
    deleteNetwork: (state, action) => {
      const index = state.findIndex(loc => loc.id === action.payload)
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
    setNetworks: (_state, action) => {
      return action.payload;
    },
  }
})
// Export action creators
export const { addNetwork, updateNetwork, deleteNetwork, setNetworks } = networkSlice.actions

// Create a slice for security
export const securitySlice = createSlice({
  name: 'security',
  initialState: {
    connections: {},
    isInitialized: false
  },
  reducers: {
    initializeConnections: (state, action) => {
      const { networkIds } = action.payload;
      networkIds.forEach(id1 => {
        networkIds.forEach(id2 => {
          if (id1 !== id2) {
            state.connections[`${id1}-${id2}`] = false;
          }
        });
      });
      state.isInitialized = true;
    },
    toggleConnection: (state, action) => {
      const { network1Id, network2Id } = action.payload;
      const key1 = `${network1Id}-${network2Id}`;
      const key2 = `${network2Id}-${network1Id}`;
      state.connections[key1] = !state.connections[key1];
      state.connections[key2] = state.connections[key1];
    },
    setConnection: (state, action) => {
      const { network1Id, network2Id, isConnected } = action.payload;
      const key1 = `${network1Id}-${network2Id}`;
      const key2 = `${network2Id}-${network1Id}`;
      state.connections[key1] = isConnected;
      state.connections[key2] = isConnected;
    },
    setSecurity: (_state, action) => {
      return action.payload;
    },
  },
});

export const { initializeConnections, toggleConnection, setConnection, setSecurity } = securitySlice.actions;

export const selectConnectionStatus = (state, network1Id, network2Id) => 
  state.security.connections[`${network1Id}-${network2Id}`] || false;

export const selectIsInitialized = (state) => state.security.isInitialized;

// Configure the store
const store = configureStore({
  reducer: {
    organizations: organizationsSlice.reducer,
    locations: locationsSlice.reducer,
    networks: networkSlice.reducer,
    security: securitySlice.reducer
  },
})

export default store