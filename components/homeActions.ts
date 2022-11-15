import { TOGGLE_USER } from "./homeReducer"
import { action } from "typesafe-actions"

export const toggle = () => action(TOGGLE_USER)
