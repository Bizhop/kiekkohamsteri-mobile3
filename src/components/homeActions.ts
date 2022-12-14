import { action } from "typesafe-actions"
import { pick } from "ramda"

import {
  CONSENT_LOADED,
  LOGIN,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  PREPARE_USER_UPDATE,
  SET_CONSENT,
  SET_LANGUAGE,
  UNSET_CONSENT,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_SUCCESS,
} from "../constants/actionNames"
import { loginPayload, patchPayload } from "../Api"
import { IResponsePayload, IUser } from "../types"

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
export const setConsent = () => action(SET_CONSENT)
export const unsetConsent = () => action(UNSET_CONSENT)
export const consentLoaded = (consent: string | null) => action(CONSENT_LOADED, { consent })
export const setLanguage = (language: string) => action(SET_LANGUAGE, { language })
