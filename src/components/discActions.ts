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
  GET_DISCS_NEXT_PAGE,
  GET_DISCS_NEXT_PAGE_SUCCESS,
  GET_DISCS_NEXT_PAGE_FAIL,
  UPDATE_IMAGE,
  UPDATE_IMAGE_SUCCESS,
  UPDATE_IMAGE_FAIL,
} from "../constants/actionNames"

import { deletePayload, getPayload, postPayload, putPayload, patchPayload } from "../Api"
import { IDisc, IPagination, IResponsePagedPayload, IResponsePayload, ISort } from "../types"

const pagingAndSortingQueryParams = (sort: ISort, pagination: IPagination) =>
  `size=${pagination.size}&page=${pagination.number}&sort=${sort.sort}`

export const prepareGet = () => action(PREPARE_GET_DISC)
export const prepareEdit = (index: number) => action(PREPARE_EDIT_DISC, { index })
export const prepareCreate = () => action(PREPARE_CREATE_DISC)

export const get = (sort: ISort, pagination: IPagination, token: string) => action(GET_DISCS, getPayload(`/v2/discs?${pagingAndSortingQueryParams(sort, pagination)}`, token))
export const getSuccess = (payload: IResponsePagedPayload<IDisc>) =>
  action(GET_DISCS_SUCCESS, payload)
export const getFail = () => action(GET_DISCS_FAIL)

export const getNextPage = (sort: ISort, pagination: IPagination, token: string) => action(GET_DISCS_NEXT_PAGE, getPayload(`/v2/discs?${pagingAndSortingQueryParams(sort, pagination)}`, token))
export const getNextPageSuccess = (payload: IResponsePagedPayload<IDisc>) => action(GET_DISCS_NEXT_PAGE_SUCCESS, payload)
export const getNextPageFail = () => action(GET_DISCS_NEXT_PAGE_FAIL)

export const updateDisc = (token: string, disc: any, uuid: string) =>
  action(UPDATE_DISC, putPayload(`/v2/discs/${uuid}`, disc, token))
export const updateDiscSuccess = (payload: IResponsePayload<IDisc>) =>
  action(UPDATE_DISC_SUCCESS, payload)
export const updateDiscFail = () => action(UPDATE_DISC_FAIL)

export const createDisc = (token: string) =>
  action(CREATE_DISC, postPayload("/v2/discs", null, token))
export const createDiscSuccess = (payload: IResponsePayload<IDisc>) =>
  action(CREATE_DISC_SUCCESS, payload)
export const createDiscFail = () => action(CREATE_DISC_FAIL)

export const updateImage = (token: string, data: string, uuid: string) => action(UPDATE_IMAGE, patchPayload(`/v2/discs/${uuid}/update-image`, { data }, token), { data })
export const updateImageSuccess = (payload: IResponsePayload<IDisc>) => action(UPDATE_IMAGE_SUCCESS, payload)
export const updateImageFail = () => action(UPDATE_IMAGE_FAIL)

export const deleteDisc = (token: string, uuid: string) =>
  action(DELETE_DISC, deletePayload(`/v2/discs/${uuid}`, token), { uuid })
export const deleteSuccess = (payload: any, meta: any) => action(DELETE_DISC_SUCCESS, payload, meta)
export const deleteFail = () => action(DELETE_DISC_FAIL)
