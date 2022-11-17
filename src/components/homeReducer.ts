import { HomeActions, IHomeState } from "../types"
import { dissoc } from "ramda"
// import * as SecureStore from 'expo-secure-store'

export const LOGIN = "home/LOGIN"
export const LOGIN_SUCCESS = "home/LOGIN_SUCCESS"
export const LOGIN_FAIL = "home/LOGIN_FAIL"
export const LOGOUT = "home/LOGOUT"

const initialState: IHomeState = {
  user: null,
  error: null,
}

export default function homeReducer(
  state: IHomeState = initialState,
  action: HomeActions,
): IHomeState {
  console.log(action)
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: null,
        error: null
      }
    case LOGIN_SUCCESS:
      // SecureStore.setItemAsync("token", action.payload.data.jwt)
      return {
        ...state,
        user: dissoc("jwt", action.payload.data),
        error: null
      }
    case LOGIN_FAIL:
      // SecureStore.deleteItemAsync("token")
      return {
        ...state,
        user: null,
        error: "Login failed: " + JSON.stringify(action.payload)
      }
    case LOGOUT:
      return initialState
    default:
      return state
  }
}
