import * as React from "react"
import { StyleSheet } from "react-native"
import { View, Text } from "../components/Themed"

import { IUser } from "../types"
import { i18n } from "../translations"

const AccessCheck = (props: {user: IUser | null, consent: boolean}): JSX.Element =>
  <View style={styles.container}>
    {!props.user && <Text style={styles.title}>{i18n.t("home.user.notLoggedIn")}</Text>}
    {!props.consent && <Text style={styles.title}>{i18n.t("home.consent.noConsent")}</Text>}
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
