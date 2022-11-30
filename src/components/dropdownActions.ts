import { action } from "typesafe-actions"

import { getPayload } from "../Api"
import { IDropdowns, IResponsePayload } from "../types"
import { GET_DROPDOWNS, GET_DROPDOWNS_FAIL, GET_DROPDOWNS_SUCCESS } from "../constants/actionNames"

export const get = (token: string) =>
  action(GET_DROPDOWNS, getPayload("/dropdown", token), { manufacturerId: null })
export const getByManufacturerId = (id: number, token: string) =>
  action(GET_DROPDOWNS, getPayload(`/dropdown?valmId=${id}`, token), { manufacturerId: id })
export const getSuccess = (payload: IResponsePayload<IDropdowns>) =>
  action(GET_DROPDOWNS_SUCCESS, payload)
export const getFail = (payload: IResponsePayload<IDropdowns>) =>
  action(GET_DROPDOWNS_FAIL, payload)
