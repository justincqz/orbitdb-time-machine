import React, {createContext, useContext, useReducer, Reducer} from 'react';

// Actions for the reducer. Type is used to determine the action, payload contains data
export interface reducerAction {
  type: string;
  payload: {
    dbUrl?: string;
  };
}

// Create the context so state is accessible thorugh the app
const StateContext : React.Context<Object> = createContext({});

// Function to take actions and return states
const reducer : Reducer<Object, reducerAction> = (prevState, action) => {
  switch (action.type) {
    case 'setOrbitdbUrl':
      return {url: action.payload.dbUrl, ...prevState}
  }
  return prevState;
}

// Provider that must be placed at top of component tree
export const StateProvider = ({ children }: {children: JSX.Element[] | JSX.Element}) => (
  <StateContext.Provider value={useReducer(reducer, {})}>
    {children}
  </StateContext.Provider>
);

// Consumer function to use thorughout app
export const useStateValue = () => useContext(StateContext);