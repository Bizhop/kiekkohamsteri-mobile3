import { action } from "typesafe-actions"
import { GET, GET_FAIL, GET_SUCCESS, PREPARE_GET } from "./discReducer"
import { getPayload } from "../Api"
import { AxiosResponse } from "../types"

export const prepareGet = () => action(PREPARE_GET)
export const get = (token: string) => action(GET, getPayload("/kiekot", token))
export const getSuccess = (payload: any): AxiosResponse => action(GET_SUCCESS, payload)
export const getFail = (payload: any): AxiosResponse => action(GET_FAIL, payload)
