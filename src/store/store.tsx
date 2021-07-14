import React, { createContext, useContext, useReducer } from "react";
import GlobalReducer, { Action } from "./reducer";

export interface GlobalContext {
  darkTheme: boolean;
}

const defaultGlobal:GlobalContext = {
    darkTheme: false,
  };

export interface GlobalStore {
  state: GlobalContext;
  dispatch?: React.Dispatch<Action>;
}

const context = createContext<GlobalStore>({ state: defaultGlobal });

export const useGlobalContext = () => useContext(context);

export const Store:React.FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, defaultGlobal);
  return <context.Provider value={{ state, dispatch }} children={children} />;
};
