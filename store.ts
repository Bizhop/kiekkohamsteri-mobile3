import { legacy_createStore as createStore, combineReducers } from 'redux'
import homeReducer from './components/homeReducer'
import { IHomeState } from './types'

export interface IRootState {
  home: IHomeState
}

const store = createStore<IRootState, any, any, any>(
  combineReducers({
    home: homeReducer
  }))

export default store
