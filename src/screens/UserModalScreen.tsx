import * as React from "react"
import { StatusBar } from "expo-status-bar"
import { Platform, StyleSheet, Button } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Form, FormItem } from "react-native-form-component"
import * as SecureStore from 'expo-secure-store'

import { Text, View } from "../components/Themed"
import { IRootState } from "../store"
import { HomeActions, IHomeState, IUser } from "../types"
import * as homeActions from "../components/homeActions"

const mapStateToProps = ({ home }: IRootState): IHomeState => {
  return home
}

const updateUser = (user: IUser, dispatch: Dispatch<HomeActions>) => {
  dispatch(homeActions.prepareUserUpdate())
  SecureStore.getItemAsync("token").then(token => token && dispatch(homeActions.updateUser(user, token)))
}

const mapDispatcherToProps = (dispatch: Dispatch<HomeActions>) => {
  return {
    updateUser: (user: IUser) => updateUser(user, dispatch)
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const UserModalScreen = (props: ReduxType) => {
  const { user, updateUser } = props

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit user details</Text>
      {user && <UserEditForm initialValues={user} update={updateUser} />}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  )
}

const UserEditForm = (props: { initialValues: IUser, update: (user: IUser) => void }) => {
  const [username, setUserName] = React.useState(props.initialValues.username)
  const [firstName, setFirstName] = React.useState(props.initialValues.firstName)
  const [lastName, setLastName] = React.useState(props.initialValues.lastName)
  const [pdgaNumber, setPdgaNumber] = React.useState(props.initialValues.pdgaNumber)

  return (
    <Form onButtonPress={() => props.update({id: props.initialValues.id, username, firstName, lastName, pdgaNumber})} buttonText="Update">
      <FormItem
        value={username}
        label="Username"
        onChangeText={setUserName}
      />
      <FormItem
        value={firstName}
        label="FirstName"
        onChangeText={setFirstName}
      />
      <FormItem
        value={lastName}
        label="LastName"
        onChangeText={setLastName}
      />
      <FormItem
        value={pdgaNumber.toString()}
        label="PDGA number"
        onChangeText={value => setPdgaNumber(parseInt(value))}
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
  },
})
