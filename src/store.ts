import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux"
import axios from "axios"
import axiosMiddleware from "redux-axios-middleware"

import homeReducer from "./components/homeReducer"
import { IDiscsState, IDropdownsState, IHomeState } from "./types"
import discsReducer from "./components/discReducer"
import dropdownReducer from "./components/dropdownReducer"

export interface IRootState {
  home: IHomeState
  discs: IDiscsState
  dropdowns: IDropdownsState
}

const client = axios.create({
  baseURL: "https://kiekkohamsteri-backend.valuemotive.net/api",
  responseType: "json",
})

const store = createStore<IRootState, any, any, any>(
  combineReducers({
    home: homeReducer,
    discs: discsReducer,
    dropdowns: dropdownReducer,
  }),
  applyMiddleware(axiosMiddleware(client)),
)

export default store
