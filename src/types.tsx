import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ActionType } from "typesafe-actions"

import * as homeActions from "./components/homeActions"
import * as discActions from "./components/discActions"

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined
  User: undefined
  NotFound: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>

export type RootTabParamList = {
  TabOne: undefined
  TabTwo: undefined
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>

export interface IHomeState {
  user: IUser | null
  userUpdating: boolean,
  error: string | null
}

export interface IDiscsState {
  discs: Array<IDisc>,
  loading: boolean
  error: string | null
}

export type HomeActions = ActionType<typeof homeActions>
export type DiscActions = ActionType<typeof discActions>

interface IRequest {
  url: string,
  headers?: any,
  method?: string,
  data?: any
}

export interface IRequestPayload {
  request: IRequest
}

export interface IResponsePayload<T> {
  data: T
}

export interface IResponsePagedPayload<T> {
  data: {
    content: Array<T>
  }
}

export interface IAxiosResponse<T> {
  type: string,
  payload?: IResponsePayload<T>
  meta?: any,
  error?: any
}

export interface IAxiosPagedResponse<T> {
  type: string,
  payload?: IResponsePagedPayload<T>
  meta?: any,
  error?: any
}

interface IRole {
  id: number,
  name: string,
  groupId: number
}

interface IGroup {
  id: number,
  name: string
}

export interface IUser {
  id: number,
  username: string,
  email?: string,
  firstName: string,
  lastName: string,
  pdgaNumber: number,
  jwt?: string,
  roles?: Array<IRole>,
  groups?: Array<IGroup>
}

export interface IDisc {
  id: number,
  omistaja: string,
  valmistaja: string,
  valmId: number,
  mold: string,
  moldId: number,
  muovi: string,
  muoviId: number,
  vari: string,
  variId: number,
  nopeus: number,
  liito: number,
  vakaus: number,
  feidi: number,
  kuva: string,
  paino: number,
  kunto: number,
  hohto: boolean,
  spessu: boolean,
  dyed: boolean,
  swirly: boolean,
  tussit: number,
  myynnissa: boolean,
  hinta: number,
  muuta: string,
  loytokiekko: boolean,
  itb: boolean,
  publicDisc: boolean,
  lost: boolean,
  createdAt: string,
  updatedAt: string
}
