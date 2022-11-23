import { action } from "typesafe-actions"

import {
  GET,
  GET_FAIL,
  GET_SUCCESS,
  PREPARE_EDIT,
  PREPARE_GET,
  UPDATE,
  UPDATE_FAIL,
  UPDATE_SUCCESS,
} from "./discReducer"
import { getPayload, putPayload } from "../Api"
import { IDisc, IResponsePagedPayload, IResponsePayload } from "../types"

export const prepareGet = () => action(PREPARE_GET)
export const prepareEdit = (index: number) => action(PREPARE_EDIT, { index })
export const get = (token: string) => action(GET, getPayload("/kiekot", token))
export const getSuccess = (payload: IResponsePagedPayload<IDisc>) => action(GET_SUCCESS, payload)
export const getFail = (payload: IResponsePagedPayload<IDisc>) => action(GET_FAIL, payload)
export const updateDisc = (token: string, disc: any, id: number) =>
  action(UPDATE, putPayload(`/kiekot/${id}`, disc, token))
export const updateDiscSuccess = (payload: IResponsePayload<IDisc>) =>
  action(UPDATE_SUCCESS, payload)
export const updateDiscFail = (payload: IResponsePayload<IDisc>) => action(UPDATE_FAIL, payload)
