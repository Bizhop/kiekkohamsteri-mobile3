import { pathOr } from "ramda"

import { DiscActions, IDiscsState } from "../types"

export const PREPARE_GET = "discs/PREPARE_GET"
export const GET = "discs/GET"
export const GET_SUCCESS = "discs/GET_SUCCESS"
export const GET_FAIL = "discs/GET_FAIL"

const initialState: IDiscsState = {
  discs: [],
  loading: false,
  error: null
}

export default function discsReducer(
  state: IDiscsState = initialState,
  action: DiscActions
): IDiscsState {
  action.type.startsWith("discs") && console.log(action)
  switch (action.type) {
    case PREPARE_GET:
      return {
        ...state,
        loading: true
      }
    case GET:
      return {
        ...state,
        discs: [],
        error: null
      }
    case GET_SUCCESS:
      return {
        ...state,
        loading: false,
        discs: pathOr([], ["payload", "data", "content"], action),
        error: null
      }
    case GET_FAIL:
      return {
        ...state,
        loading: false,
        discs: [],
        error: "Get discs failed: " + action.error?.message
      }
    default:
      return state
  }
}
