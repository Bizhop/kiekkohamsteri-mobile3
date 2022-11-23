import { action } from "typesafe-actions"

import { getPayload } from "../Api"
import { IDropdowns, IResponsePayload } from "../types"
import { GET, GET_FAIL, GET_SUCCESS } from "./dropdownReducer"

export const get = (token: string) =>
  action(GET, getPayload("/dropdown", token), { manufacturerId: null })
export const getByManufacturerId = (id: number, token: string) =>
  action(GET, getPayload(`/dropdown?valmId=${id}`, token), { manufacturerId: id })
export const getSuccess = (payload: IResponsePayload<IDropdowns>) => action(GET_SUCCESS, payload)
export const getFail = (payload: IResponsePayload<IDropdowns>) => action(GET_FAIL, payload)
