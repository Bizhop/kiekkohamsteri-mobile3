import * as React from "react"
import * as Google from "expo-auth-session/providers/google"
import { StyleSheet, Button } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as SecureStore from "expo-secure-store"

import { Text, View } from "../components/Themed"
import { IRootState } from "../store"
import { HomeActions, IHomeState, RootStackParamList } from "../types"
import * as homeActions from "../components/homeActions"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

const mapStateToProps = ({ home }: IRootState): IHomeState => {
  return home
}

const autoLogin = (dispatch: Dispatch<HomeActions>) => {
  SecureStore.getItemAsync("token").then((token) => token && dispatch(homeActions.login(token)))
}

const mapDispatcherToProps = (dispatch: Dispatch<HomeActions>) => {
  return {
    autoLogin: autoLogin(dispatch),
    login: (token: string) => dispatch(homeActions.login(token)),
    logout: () => dispatch(homeActions.logout()),
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatcherToProps> &
  NativeStackScreenProps<RootStackParamList>

const TabOneScreen = (props: ReduxType) => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: "368284396209-ein43uvg6fe6etku0fl464kcno7v66sp.apps.googleusercontent.com",
    androidClientId: "368284396209-9mdl024mu9bj3mpadovsk4le6uq8g5c8.apps.googleusercontent.com",
  })

  const { user, error, login, logout, navigation } = props

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response?.params
      login(id_token)
    }
  }, [response])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kiekkohamsteri</Text>
      {user && <Text>User: {user.username}</Text>}
      {user && <Button title="New disc" onPress={() => navigation.navigate("Camera")} />}
      {error && <Text>Error: {error}</Text>}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {user ? (
        <Button title="Logout" onPress={logout} />
      ) : (
        <Button disabled={!request} title="Login" onPress={() => promptAsync()} />
      )}
    </View>
  )
}

export default connect(mapStateToProps, mapDispatcherToProps)(TabOneScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})
