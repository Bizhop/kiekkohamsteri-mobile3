import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ActionType } from "typesafe-actions"

import * as homeActions from "./components/homeActions"
import * as discActions from "./components/discActions"
import * as dropdownActions from "./components/dropdownActions"

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined
  User: undefined
  Disc: undefined
  Camera: undefined
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
  loadingConsent: boolean
  consent: boolean
  user: IUser | null
  userUpdating: boolean
  error: string | null
  language: string
}

export interface IDiscsState {
  discs: Array<IDisc>
  loading: boolean
  discInEdit: IDisc | null
  error: string | null,
  lastPage: boolean
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
    content: Array<T>,
    last: boolean
  },
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
  error?: string
}

export interface IManufacturer {
  id: number
  name: string
}

export interface IMold {
  id: number
  manufacturer: IManufacturer
  name: string
  speed: number
  glide: number
  stability: number
  fade: number
}

export interface IPlastic {
  id: number
  manufacturer: IManufacturer
  name: string
}

export interface IColor {
  id: number
  name: string
}

export interface IDisc {
  uuid: string
  owner: IUser
  mold: IMold
  plastic: IPlastic
  color: IColor
  image: string
  weight: number
  condition: number
  glow: boolean
  special: boolean
  dyed: boolean
  swirly: boolean
  markings: number
  forSale: boolean
  price: number
  description: string
  lostAndFound: boolean
  itb: boolean
  publicDisc: boolean
  lost: boolean
  createdAt: string
  updatedAt: string
}

export interface IDiscUpdate {
  moldId: number
  plasticId: number
  colorId: number
  weight: number
  condition: number
  glow: boolean
  special: boolean
  dyed: boolean
  swirly: boolean
  markings: number
  forSale: boolean
  price: number
  description: string
  lostAndFound: boolean
  itb: boolean
  publicDisc: boolean
  lost: boolean
}

interface DefaultDropdown {
  value: number
  name: string
}

export interface IDropdowns {
  manufacturers: Array<DefaultDropdown>
  molds: Array<DefaultDropdown>
  plastics: Array<DefaultDropdown>
  colors: Array<DefaultDropdown>
  conditions: Array<DefaultDropdown>
  markings: Array<DefaultDropdown>
}

export interface Item {
  label: string
  value: number
}

export interface ISort {
  sort: string,
  column: string
}

export interface IPagination {
  number: number,
  size: number,
}
