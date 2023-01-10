import { IDropdownsState, DropdownActions } from "../types"

import { GET_DROPDOWNS, GET_DROPDOWNS_SUCCESS } from "../constants/actionNames"

const initialState: IDropdownsState = {
  dropdowns: {
    molds: [],
    manufacturers: [],
    plastics: [],
    colors: [],
    conditions: [],
    markings: [],
  },
  selectedManufacturerId: null,
}

export default function dropdownReducer(
  state: IDropdownsState = initialState,
  action: DropdownActions,
): IDropdownsState {
  //action.type.startsWith("dropdowns") && console.log(action)
  switch (action.type) {
    case GET_DROPDOWNS:
      return {
        ...state,
        selectedManufacturerId: action.meta.manufacturerId,
      }
    case GET_DROPDOWNS_SUCCESS:
      return {
        ...state,
        dropdowns: action.payload.data,
      }
    default:
      return state
  }
}
