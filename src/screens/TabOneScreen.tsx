import * as React from "react"
import * as Google from "expo-auth-session/providers/google"
import { StyleSheet, Button } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as SecureStore from 'expo-secure-store'

import { Text, View } from "../components/Themed"
import { IRootState } from "../store"
import { DiscActions, HomeActions } from "../types"
import * as homeActions from "../components/homeActions"
import { get, prepareGet } from "../components/discActions"

const mapStateToProps = ({ home, discs }: IRootState) => {
  return {
    user: home.user,
    error: home.error,
    discs: discs.discs,
    loadingDiscs: discs.loading
  }
}

const autoLogin = (dispatch: Dispatch) => {
  SecureStore.getItemAsync("token").then(token => token && dispatch(homeActions.login(token)))
}

const mapDispatcherToProps = (dispatch: Dispatch<HomeActions> & Dispatch<DiscActions>) => {
  return {
    autoLogin: autoLogin(dispatch),
    login: (token: string) => dispatch(homeActions.login(token)),
    logout: () => dispatch(homeActions.logout()),
    getDiscs: () => {
      dispatch(prepareGet())
      SecureStore.getItemAsync("token").then(token => token && dispatch(get(token)))
    }
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const TabOneScreen = (props: ReduxType) => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: "368284396209-ein43uvg6fe6etku0fl464kcno7v66sp.apps.googleusercontent.com",
    androidClientId: "368284396209-9mdl024mu9bj3mpadovsk4le6uq8g5c8.apps.googleusercontent.com",
  })

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response?.params
      props.login(id_token)
    }
  }, [response])

  const { user, error, discs, loadingDiscs } = props

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kiekkohamsteri</Text>
      {user && <Text>User: {user.username}</Text>}
      {error && <Text>Error: {error}</Text>}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {user && <Button disabled={loadingDiscs} title="Get discs" onPress={props.getDiscs} /> }
      {user && discs.length > 0 && <Text>Discs: {discs.length}</Text>}
      {user
        ? <Button title="Logout" onPress={props.logout} />
        : <Button disabled={!request} title="Login" onPress={() => promptAsync()} />
      }
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
