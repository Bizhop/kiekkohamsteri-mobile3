import { IDropdownsState, DropdownActions } from "../types"

export const GET = "dropdowns/GET"
export const GET_SUCCESS = "dropdowns/GET_SUCCESS"
export const GET_FAIL = "dropdowns/GET_FAIL"

const initialState: IDropdownsState = {
  dropdowns: {
    molds: [],
    valms: [],
    muovit: [],
    varit: [],
    kunto: [],
    tussit: [],
  },
  selectedManufacturerId: null,
}

export default function dropdownReducer(
  state: IDropdownsState = initialState,
  action: DropdownActions,
): IDropdownsState {
  action.type.startsWith("dropdowns") && console.log(action)
  switch (action.type) {
    case GET:
      return {
        ...state,
        selectedManufacturerId: action.meta.manufacturerId,
      }
    case GET_SUCCESS:
      return {
        ...state,
        dropdowns: action.payload.data,
      }
    default:
      return state
  }
}
