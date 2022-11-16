import { HomeActions, IHomeState } from "../types"

export const LOGIN = "home/LOGIN"

const initialState: IHomeState = {
  user: null,
  error: null,
}

export default function homeReducer(
  state: IHomeState = initialState,
  action: HomeActions,
): IHomeState {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: { token: action.payload.token },
      }
    default:
      return state
  }
}
