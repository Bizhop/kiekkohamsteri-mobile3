import { Payload } from "./types"

export const loginPayload = (token: string): Payload => ({
  request: {
    method: "get",
    url: "/v2/login",
    headers: {
      Authorization: token
    }
  }
})

export const getPayload = (url: string, token: string): Payload => ({
  request: {
    method: "get",
    url,
    headers: {
      Authorization: token
    }
  }
})
