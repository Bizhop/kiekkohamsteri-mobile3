import { action } from "typesafe-actions"
import { GET, GET_FAIL, GET_SUCCESS } from "./discReducer"
import { getPayload } from "../Api"

export const get = (token: string) => action(GET, getPayload("/kiekot", token))
export const getSuccess = (payload: any) => action(GET_SUCCESS, payload)
export const getFail = (payload: any) => action(GET_FAIL, payload)
