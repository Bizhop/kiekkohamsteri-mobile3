import { Button, StyleSheet } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"

import EditScreenInfo from "../components/EditScreenInfo"
import { Text, View } from "../components/Themed"
import { IRootState } from "../store"
import { HomeActions, IHomeState } from "../types"
import * as homeActions from "../components/homeActions"

const mapStateToProps = ({home}: IRootState) => {
  const { user } = home
  return { user }
}

const mapDispatcherToProps = (dispatch: Dispatch<HomeActions>) => {
  return {
    toggle: () => dispatch(homeActions.toggle())
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const TabOneScreen = (props: ReduxType) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One for {props.user}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button
        title="Toggle"
        onPress={props.toggle}
      />
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
