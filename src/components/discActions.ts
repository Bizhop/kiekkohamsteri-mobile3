import { action } from "typesafe-actions"

import {
  CREATE_DISC,
  CREATE_DISC_FAIL,
  CREATE_DISC_SUCCESS,
  GET_DISCS,
  GET_DISCS_FAIL,
  GET_DISCS_SUCCESS,
  PREPARE_EDIT_DISC,
  PREPARE_GET_DISC,
  UPDATE_DISC,
  UPDATE_DISC_FAIL,
  UPDATE_DISC_SUCCESS,
  PREPARE_CREATE_DISC,
  DELETE_DISC,
  DELETE_DISC_SUCCESS,
  DELETE_DISC_FAIL,
} from "../constants/actionNames"

import { deletePayload, getPayload, postPayload, putPayload } from "../Api"
import { IDisc, IResponsePagedPayload, IResponsePayload } from "../types"

export const prepareGet = () => action(PREPARE_GET_DISC)
export const prepareEdit = (index: number) => action(PREPARE_EDIT_DISC, { index })
export const get = (token: string) => action(GET_DISCS, getPayload("/v2/discs", token))
export const getSuccess = (payload: IResponsePagedPayload<IDisc>) =>
  action(GET_DISCS_SUCCESS, payload)
export const getFail = (payload: IResponsePagedPayload<IDisc>) => action(GET_DISCS_FAIL, payload)
export const updateDisc = (token: string, disc: any, id: number) =>
  action(UPDATE_DISC, putPayload(`/v2/discs/${id}`, disc, token))
export const updateDiscSuccess = (payload: IResponsePayload<IDisc>) =>
  action(UPDATE_DISC_SUCCESS, payload)
export const updateDiscFail = (payload: IResponsePayload<IDisc>) =>
  action(UPDATE_DISC_FAIL, payload)
export const prepareCreate = () => action(PREPARE_CREATE_DISC)
export const createDisc = (token: string, data: string) =>
  action(CREATE_DISC, postPayload("/v2/discs", { data }, token))
export const createDiscSuccess = (payload: IResponsePayload<IDisc>) =>
  action(CREATE_DISC_SUCCESS, payload)
export const createDiscFail = (payload: IResponsePayload<IDisc>) =>
  action(CREATE_DISC_FAIL, payload)
export const deleteDisc = (token: string, id: number) =>
  action(DELETE_DISC, deletePayload(`/v2/discs/${id}`, token), { id })
export const deleteSuccess = (payload: any, meta: any) => action(DELETE_DISC_SUCCESS, payload, meta)
export const deleteFail = (payload: any, meta: any) => action(DELETE_DISC_FAIL, payload, meta)
