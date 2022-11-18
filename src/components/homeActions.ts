import { LOGIN, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from "./homeReducer"
import { action } from "typesafe-actions"
import { loginPayload } from "../Api"
import { AxiosResponse } from "../types"

export const login = (token: string) => action(LOGIN, loginPayload(token))
export const loginSuccess = (payload: any): AxiosResponse => action(LOGIN_SUCCESS, payload)
export const loginFail = (payload: any): AxiosResponse => action(LOGIN_FAIL, payload)

export const logout = () => action(LOGOUT)
