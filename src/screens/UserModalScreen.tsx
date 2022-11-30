import * as React from "react"
import { StatusBar } from "expo-status-bar"
import { Platform, StyleSheet, TouchableOpacity } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Form, FormItem } from "react-native-form-component"
import * as SecureStore from "expo-secure-store"

import { Text, View } from "../components/Themed"
import { IRootState } from "../store"
import { HomeActions, IHomeState, IUser, RootStackParamList } from "../types"
import * as homeActions from "../components/homeActions"
import AccessCheck from "./AccessCheck"
import Colors from "../constants/Colors"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { i18n } from "../translations"

const mapStateToProps = ({ home }: IRootState): IHomeState => {
  return home
}

const updateUser = (user: IUser, dispatch: Dispatch<HomeActions>) => {
  dispatch(homeActions.prepareUserUpdate())
  SecureStore.getItemAsync("token").then(
    (token) => token && dispatch(homeActions.updateUser(user, token)),
  )
}

const unsetConsent = (
  dispatch: Dispatch,
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  SecureStore.deleteItemAsync("consent").then(() => {
    dispatch(homeActions.unsetConsent())
    navigation.navigate("Root")
  })
}

const mapDispatcherToProps = (dispatch: Dispatch<HomeActions>) => {
  return {
    updateUser: (user: IUser) => updateUser(user, dispatch),
    unsetConsent: (navigation: NativeStackNavigationProp<RootStackParamList>) =>
      unsetConsent(dispatch, navigation),
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatcherToProps> &
  NativeStackScreenProps<RootStackParamList>

const UserModalScreen = (props: ReduxType) => {
  const { consent, user, updateUser, unsetConsent, navigation } = props

  if (!user || !consent) {
    return <AccessCheck user={user} consent={consent} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("home.user.edit")}</Text>
      <UserEditForm initialValues={user} update={updateUser} />
      <TouchableOpacity style={styles.button} onPress={() => unsetConsent(navigation)}>
        <Text darkColor="white" lightColor="white">
          {i18n.t("home.consent.remove")}
        </Text>
      </TouchableOpacity>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  )
}

const UserEditForm = (props: { initialValues: IUser; update: (user: IUser) => void }) => {
  const { initialValues, update } = props

  const [username, setUserName] = React.useState(initialValues.username)
  const [firstName, setFirstName] = React.useState(initialValues.firstName)
  const [lastName, setLastName] = React.useState(initialValues.lastName)
  const [pdgaNumber, setPdgaNumber] = React.useState(initialValues.pdgaNumber)

  return (
    <Form
      onButtonPress={() =>
        update({ id: initialValues.id, username, firstName, lastName, pdgaNumber })
      }
      buttonText={i18n.t("home.user.update")}
    >
      <FormItem value={username} label={i18n.t("home.user.username")} onChangeText={setUserName} />
      <FormItem
        value={firstName}
        label={i18n.t("home.user.firstName")}
        onChangeText={setFirstName}
      />
      <FormItem value={lastName} label={i18n.t("home.user.lastName")} onChangeText={setLastName} />
      <FormItem
        value={pdgaNumber.toString()}
        label={i18n.t("home.user.pdgaNumber")}
        onChangeText={(value) => setPdgaNumber(parseInt(value))}
      />
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatcherToProps)(UserModalScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    margin: 20,
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.blue.dark,
    backgroundColor: Colors.blue.normal,
  },
})
