import * as React from "react"
import * as Google from "expo-auth-session/providers/google"
import { StyleSheet, Button } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"

import EditScreenInfo from "../components/EditScreenInfo"
import { Text, View } from "../components/Themed"
import { IRootState } from "../store"
import { HomeActions } from "../types"
import * as homeActions from "../components/homeActions"

const mapStateToProps = ({ home }: IRootState) => {
  return {
    user: home.user,
  }
}

const mapDispatcherToProps = (dispatch: Dispatch<HomeActions>) => {
  return {
    login: (token: string) => dispatch(homeActions.login(token)),
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

  const { user } = props

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      {user && <Text>Token: {user.token}</Text>}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button disabled={!request} title="Login" onPress={() => promptAsync()} />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
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
