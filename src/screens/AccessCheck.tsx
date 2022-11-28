import * as React from "react"
import { StyleSheet } from "react-native";
import { View, Text } from "../components/Themed";

import { IUser } from "../types";

const AccessCheck = (props: {user: IUser | null, consent: boolean}): JSX.Element =>
  <View style={styles.container}>
    {!props.user && <Text style={styles.title}>Et ole kirjautunut</Text>}
    {!props.consent && <Text style={styles.title}>Et ole hyväksynyt sovelluksen käyttöehtoja</Text>}
  </View>

export default AccessCheck

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
})
