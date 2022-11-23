import * as SecureStore from "expo-secure-store"

import { HomeActions, IHomeState } from "../types"

export const LOGIN = "home/LOGIN"
export const LOGIN_SUCCESS = "home/LOGIN_SUCCESS"
export const LOGIN_FAIL = "home/LOGIN_FAIL"
export const PREPARE_USER_UPDATE = "home/PREPARE_USER_UPDATE"
export const UPDATE_USER = "home/UPDATE_USER"
export const UPDATE_USER_SUCCESS = "home/UPDATE_USER_SUCCESS"
export const UPDATE_USER_FAIL = "home/UPDATE_USER_FAIL"
export const LOGOUT = "home/LOGOUT"

const initialState: IHomeState = {
  user: null,
  userUpdating: false,
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
        error: null,
      }
    case LOGIN_SUCCESS:
      const loginSuccessPayload = action.payload || null
      if (loginSuccessPayload) {
        SecureStore.setItemAsync("token", loginSuccessPayload.data.jwt || "")
        return {
          ...state,
          user: loginSuccessPayload.data,
          error: null,
        }
      } else return state
    case LOGIN_FAIL:
      SecureStore.deleteItemAsync("token")
      return {
        ...state,
        user: null,
        error: "Login failed",
      }
    case PREPARE_USER_UPDATE:
      return {
        ...state,
        userUpdating: true,
      }
    case UPDATE_USER:
      return {
        ...state,
        user: null,
        error: null,
      }
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload?.data || null,
        userUpdating: false,
      }
    case LOGOUT:
      SecureStore.deleteItemAsync("token")
      return initialState
    default:
      return state
  }
}
