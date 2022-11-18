import { action } from "typesafe-actions"
import { GET, GET_FAIL, GET_SUCCESS, PREPARE_GET } from "./discReducer"
import { getPayload } from "../Api"
import { IAxiosPagedResponse, IDisc, IResponsePagedPayload } from "../types"

export const prepareGet = () => action(PREPARE_GET)
export const get = (token: string) => action(GET, getPayload("/kiekot", token))
export const getSuccess = (payload: IResponsePagedPayload<IDisc>): IAxiosPagedResponse<IDisc> => action(GET_SUCCESS, payload)
export const getFail = (payload: IResponsePagedPayload<IDisc>): IAxiosPagedResponse<IDisc> => action(GET_FAIL, payload)
