import { Payload } from "./types"

export const loginPayload = (token: string): Payload => ({
  request: {
    url: "/v2/login",
    headers: {
      Authorization: token
    }
  }
})
