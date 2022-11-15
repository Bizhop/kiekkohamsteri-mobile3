import { HomeActions, IHomeState } from "../types"

export const TOGGLE_USER = "home/TOGGLE_USER"

const initialState: IHomeState = {
  user: "Bisse",
  error: null
}

export default function homeReducer(state: IHomeState = initialState, action: HomeActions): IHomeState {
  switch (action.type) {
    case TOGGLE_USER:
      return {
        ...state,
        user: state.user == "Bisse" ? "(empty)" : "Bisse"
      }
    default:
      return state
  }
}
