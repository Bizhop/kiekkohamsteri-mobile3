import { LOGIN } from "./homeReducer"
import { action } from "typesafe-actions"

export const login = (token: string) => action(LOGIN, { token })
