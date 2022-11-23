import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ActionType } from "typesafe-actions"

import * as homeActions from "./components/homeActions"
import * as discActions from "./components/discActions"
import * as dropdownActions from "./components/dropdownActions"
import { ReactText } from "react"

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined
  User: undefined
  Disc: undefined
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
  userUpdating: boolean
  error: string | null
}

export interface IDiscsState {
  discs: Array<IDisc>
  loading: boolean
  discInEdit: IDisc | null
  error: string | null
}

export interface IDropdownsState {
  dropdowns: IDropdowns
  selectedManufacturerId: number | null
}

export type HomeActions = ActionType<typeof homeActions>
export type DiscActions = ActionType<typeof discActions>
export type DropdownActions = ActionType<typeof dropdownActions>

interface IRequest {
  url: string
  headers?: any
  method?: string
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

interface IRole {
  id: number
  name: string
  groupId: number
}

interface IGroup {
  id: number
  name: string
}

export interface IUser {
  id: number
  username: string
  email?: string
  firstName: string
  lastName: string
  pdgaNumber: number
  jwt?: string
  roles?: Array<IRole>
  groups?: Array<IGroup>
}

export interface IDisc {
  id: number
  omistaja: string
  valmistaja: string
  valmId: number
  mold: string
  moldId: number
  muovi: string
  muoviId: number
  vari: string
  variId: number
  nopeus: number
  liito: number
  vakaus: number
  feidi: number
  kuva: string
  paino: number
  kunto: number
  hohto: boolean
  spessu: boolean
  dyed: boolean
  swirly: boolean
  tussit: number
  myynnissa: boolean
  hinta: number
  muuta: string
  loytokiekko: boolean
  itb: boolean
  publicDisc: boolean
  lost: boolean
  createdAt: string
  updatedAt: string
}

interface DefaultDropdown {
  id: number
  nimi: string
}

export interface IDropdowns {
  molds: Array<{ id: number; kiekko: string }>
  valms: Array<{ id: number; valmistaja: string }>
  muovit: Array<{ id: number; muovi: string }>
  varit: Array<{ id: number; vari: string }>
  kunto: Array<DefaultDropdown>
  tussit: Array<DefaultDropdown>
}

export interface Item {
  label: string
  value: number
}
