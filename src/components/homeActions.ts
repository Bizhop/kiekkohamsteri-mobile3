import { LOGIN, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from "./homeReducer"
import { action } from "typesafe-actions"
import { loginPayload } from "../Api"

export const login = (token: string) => action(LOGIN, loginPayload(token))
export const loginSuccess = (payload: any) => action(LOGIN_SUCCESS, payload)
export const loginFail = (payload: any) => action(LOGIN_FAIL, payload)

export const logout = () => action(LOGOUT)
