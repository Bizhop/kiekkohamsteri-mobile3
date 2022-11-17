import { pathOr } from "ramda"

import { DiscActions, IDiscsState } from "../types"

export const GET = "discs/GET"
export const GET_SUCCESS = "discs/GET_SUCCESS"
export const GET_FAIL = "discs/GET_FAIL"

const initialState: IDiscsState = {
  discs: [],
  error: null
}

export default function discsReducer(
  state: IDiscsState = initialState,
  action: DiscActions
): IDiscsState {
  console.log(action)
  switch (action.type) {
    case GET:
      return {
        ...state,
        discs: [],
        error: null
      }
    case GET_SUCCESS:
      return {
        ...state,
        discs: pathOr([], ["payload", "data", "content"], action),
        error: null
      }
    case GET_FAIL:
      return {
        ...state,
        discs: [],
        error: "Get discs failed: " + JSON.stringify(action.payload)
      }
    default:
      return state
  }
}
