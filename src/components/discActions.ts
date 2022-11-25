import { action } from "typesafe-actions"

import {
  CREATE,
  CREATE_FAIL,
  CREATE_SUCCESS,
  GET,
  GET_FAIL,
  GET_SUCCESS,
  PREPARE_EDIT,
  PREPARE_GET,
  UPDATE,
  UPDATE_FAIL,
  UPDATE_SUCCESS,
  PREPARE_CREATE,
  DELETE,
  DELETE_SUCCESS,
  DELETE_FAIL,
} from "./discReducer"
import { deletePayload, getPayload, postPayload, putPayload } from "../Api"
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
export const prepareCreate = () => action(PREPARE_CREATE)
export const createDisc = (token: string, data: string) =>
  action(CREATE, postPayload("/kiekot", { data }, token))
export const createDiscSuccess = (payload: IResponsePayload<IDisc>) =>
  action(CREATE_SUCCESS, payload)
export const createDiscFail = (payload: IResponsePayload<IDisc>) => action(CREATE_FAIL, payload)
export const deleteDisc = (token: string, id: number) => action(DELETE, deletePayload(`/kiekot/${id}`, token), { id })
export const deleteSuccess = (payload: any, meta: any) => action(DELETE_SUCCESS, payload, meta)
export const deleteFail = (payload: any, meta: any) => action(DELETE_FAIL, payload, meta)
