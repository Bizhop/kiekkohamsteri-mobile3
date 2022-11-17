import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux"
import axios from "axios"
import axiosMiddleware from "redux-axios-middleware"

import homeReducer from "./components/homeReducer"
import { IHomeState } from "./types"

export interface IRootState {
  home: IHomeState
}

const client = axios.create({
  baseURL: "https://kiekkohamsteri-backend.valuemotive.net/api",
  responseType: "json"
})

const store = createStore<IRootState, any, any, any>(
  combineReducers({
    home: homeReducer,
  }),
  applyMiddleware(axiosMiddleware(client))
)

export default store
