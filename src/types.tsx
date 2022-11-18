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
  Modal: undefined
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
  user: any
  error: string | null
}

export interface IDiscsState {
  discs: any,
  loading: boolean
  error: string | null
}

export type HomeActions = ActionType<typeof homeActions>
export type DiscActions = ActionType<typeof discActions>

interface Request {
  url: string,
  headers?: any,
  method?: string,
  data?: any
}

export interface Payload {
  request: Request
}

export interface AxiosResponse {
  type: string,
  payload?: any,
  meta?: any,
  error?: any
}
