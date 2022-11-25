import { findIndex, prop, propEq, reject, update } from "ramda"
import { DiscActions, IDisc, IDiscsState } from "../types"

export const PREPARE_GET = "discs/PREPARE_GET"
export const PREPARE_EDIT = "discs/PREPARE_EDIT"
export const GET = "discs/GET"
export const GET_SUCCESS = "discs/GET_SUCCESS"
export const GET_FAIL = "discs/GET_FAIL"
export const GET_DROPDOWNS = "discs/GET_DROPDOWNS"
export const GET_DROPDOWNS_SUCCESS = "discs/GET_DROPDOWNS_SUCCESS"
export const GET_DROPDOWNS_FAIL = "discs/GET_DROPDOWNS_FAIL"
export const UPDATE = "discs/UPDATE"
export const UPDATE_SUCCESS = "discs/UPDATE_SUCCESS"
export const UPDATE_FAIL = "discs/UPDATE_FAIL"
export const CREATE = "discs/CREATE"
export const CREATE_SUCCESS = "discs/CREATE_SUCCESS"
export const CREATE_FAIL = "discs/CREATE_FAIL"
export const PREPARE_CREATE = "discs/PREPARE_CREATE"
export const DELETE = "discs/DELETE"
export const DELETE_SUCCESS = "discs/DELETE_SUCCESS"
export const DELETE_FAIL = "discs/DELETE_FAIL"

const initialState: IDiscsState = {
  discs: [],
  loading: false,
  discInEdit: null,
  error: null,
}

const updateDiscsArray = (discs: IDisc[], updatedDisc: IDisc) => {
  const index = findIndex(propEq("id", prop("id", updatedDisc)))(discs)
  return update(index, updatedDisc, discs)
}

export default function discsReducer(
  state: IDiscsState = initialState,
  action: DiscActions,
): IDiscsState {
  action.type.startsWith("discs") && console.log(action)
  switch (action.type) {
    case PREPARE_GET:
      return {
        ...state,
        loading: true,
      }
    case GET:
      return {
        ...state,
        discs: [],
        error: null,
      }
    case GET_SUCCESS:
      return {
        ...state,
        loading: false,
        discs: action.payload.data.content || [],
        error: null,
      }
    case GET_FAIL:
      return {
        ...state,
        loading: false,
        discs: [],
        error: "Get discs failed",
      }
    case PREPARE_EDIT:
      return {
        ...state,
        discInEdit: state.discs[action.payload.index],
      }
    case UPDATE_SUCCESS:
      const discsWithUpdate = updateDiscsArray(state.discs, action.payload.data)
      return {
        ...state,
        discs: discsWithUpdate,
        discInEdit: null,
      }
    case CREATE_SUCCESS:
      return {
        ...state,
        discInEdit: action.payload.data,
      }
    case PREPARE_CREATE:
      return {
        ...state,
        discInEdit: null,
      }
    case DELETE_SUCCESS:
      return {
        ...state,
        discs: reject((disc: IDisc) => disc.id == action.meta.previousAction.meta.id, state.discs),
        discInEdit: null
      }
    default:
      return state
  }
}
