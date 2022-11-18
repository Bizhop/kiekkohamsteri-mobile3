import { IRequestPayload } from "./types"

export const loginPayload = (token: string): IRequestPayload => ({
  request: {
    method: "get",
    url: "/v2/login",
    headers: {
      Authorization: token
    }
  }
})

export const getPayload = (url: string, token: string): IRequestPayload => ({
  request: {
    method: "get",
    url,
    headers: {
      Authorization: token
    }
  }
})

export const patchPayload = (url: string, data: any, token: string): IRequestPayload => ({
  request: {
    method: "patch",
    url,
    data,
    headers: {
      Authorization: token
    }
  }
})
