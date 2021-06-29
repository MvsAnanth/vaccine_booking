import { GlobalContext } from "./store";

export enum ActionType {
  TOGGLE_THEME = "TOGGLE_THEME",
}

export type Action =
  | { type: ActionType.TOGGLE_THEME }

const GlobalReducer = (state: GlobalContext, action: Action) => {
  switch (action.type) {
    case ActionType.TOGGLE_THEME:
      return {
        ...state,
        darkTheme: (!state.darkTheme),
      };
    default:
      return state;
  }
};

export default GlobalReducer;
