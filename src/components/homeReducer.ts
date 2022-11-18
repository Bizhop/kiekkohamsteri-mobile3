import { dissoc } from "ramda"
import * as SecureStore from 'expo-secure-store'

import { HomeActions, IHomeState } from "../types"

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
  action.type.startsWith("home") && console.log(action)
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: null,
        error: null
      }
    case LOGIN_SUCCESS:
      SecureStore.setItemAsync("token", action.payload.data.jwt)
      return {
        ...state,
        user: dissoc("jwt", action.payload.data),
        error: null
      }
    case LOGIN_FAIL:
      SecureStore.deleteItemAsync("token")
      return {
        ...state,
        user: null,
        error: "Login failed: " + action.error?.message
      }
    case LOGOUT:
      SecureStore.deleteItemAsync("token")
      return initialState
    default:
      return state
  }
}
