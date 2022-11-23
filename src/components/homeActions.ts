import {
  LOGIN,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  PREPARE_USER_UPDATE,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_SUCCESS,
} from "./homeReducer"
import { action } from "typesafe-actions"
import { loginPayload, patchPayload } from "../Api"
import { IResponsePayload, IUser } from "../types"
import { pick } from "ramda"

export const login = (token: string) => action(LOGIN, loginPayload(token))
export const loginSuccess = (payload: IResponsePayload<IUser>) => action(LOGIN_SUCCESS, payload)
export const loginFail = (payload: IResponsePayload<IUser>) => action(LOGIN_FAIL, payload)

export const prepareUserUpdate = () => action(PREPARE_USER_UPDATE)
export const updateUser = (user: IUser, token: string) =>
  action(
    UPDATE_USER,
    patchPayload(
      `/v2/user/${user.id}`,
      pick(["username", "firstName", "lastName", "pdgaNumber"], user),
      token,
    ),
  )
export const updateUserSuccess = (payload: IResponsePayload<IUser>) =>
  action(UPDATE_USER_SUCCESS, payload)
export const updateUserFail = (payload: IResponsePayload<IUser>) =>
  action(UPDATE_USER_FAIL, payload)

export const logout = () => action(LOGOUT)
