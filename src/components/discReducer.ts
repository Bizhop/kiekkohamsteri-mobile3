import { append, findIndex, prop, propEq, reject, update } from "ramda"
import {
  CREATE_DISC_SUCCESS,
  DELETE_DISC_SUCCESS,
  GET_DISCS,
  GET_DISCS_FAIL,
  GET_DISCS_SUCCESS,
  PREPARE_CREATE_DISC,
  PREPARE_EDIT_DISC,
  PREPARE_GET_DISC,
  UPDATE_DISC_SUCCESS,
} from "../constants/actionNames"
import { DiscActions, IDisc, IDiscsState } from "../types"

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
  //action.type.startsWith("discs") && console.log(action)
  switch (action.type) {
    case PREPARE_GET_DISC:
      return {
        ...state,
        loading: true,
      }
    case GET_DISCS:
      return {
        ...state,
        discs: [],
        error: null,
      }
    case GET_DISCS_SUCCESS:
      return {
        ...state,
        loading: false,
        discs: action.payload.data.content || [],
        error: null,
      }
    case GET_DISCS_FAIL:
      return {
        ...state,
        loading: false,
        discs: [],
        error: "Get discs failed",
      }
    case PREPARE_EDIT_DISC:
      return {
        ...state,
        discInEdit: state.discs[action.payload.index],
      }
    case UPDATE_DISC_SUCCESS:
      const discsWithUpdate = updateDiscsArray(state.discs, action.payload.data)
      return {
        ...state,
        discs: discsWithUpdate,
        discInEdit: null,
      }
    case CREATE_DISC_SUCCESS:
      const newDisc = action.payload.data
      return {
        ...state,
        discs: append(newDisc, state.discs),
        discInEdit: newDisc,
      }
    case PREPARE_CREATE_DISC:
      return {
        ...state,
        discInEdit: null,
      }
    case DELETE_DISC_SUCCESS:
      return {
        ...state,
        discs: reject((disc: IDisc) => disc.id == action.meta.previousAction.meta.id, state.discs),
        discInEdit: null,
      }
    default:
      return state
  }
}
