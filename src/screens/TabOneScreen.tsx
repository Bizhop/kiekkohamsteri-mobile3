import * as React from "react"
import * as Google from "expo-auth-session/providers/google"
import { StyleSheet, Button, TouchableOpacity, Image } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as SecureStore from "expo-secure-store"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { manipulateAsync } from "expo-image-manipulator"

import { Text, View } from "../components/Themed"
import { IRootState } from "../store"
import { DiscActions, HomeActions, IHomeState, RootStackParamList } from "../types"
import * as homeActions from "../components/homeActions"
import * as discActions from "../components/discActions"
import { imageFormat } from "../constants/Discs"
import Colors from "../constants/Colors"
import { logo } from "../assets/images"

const mapStateToProps = ({ home }: IRootState): IHomeState => {
  return home
}

const autoLogin = (dispatch: Dispatch<HomeActions>) => {
  SecureStore.getItemAsync("token").then((token) => token && dispatch(homeActions.login(token)))
}

const prepareCreate = (
  dispatch: Dispatch<DiscActions>,
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  dispatch(discActions.prepareCreate())
  navigation.navigate("Camera")
}

const createDisc = (dispatch: Dispatch, data: string, navigation: NativeStackNavigationProp<RootStackParamList>,) => {
  SecureStore.getItemAsync("token").then(
    (token) => token && dispatch(discActions.createDisc(token, data)),
  )
  navigation.navigate("Disc")
}

const mapDispatcherToProps = (dispatch: Dispatch<HomeActions>) => {
  return {
    autoLogin: autoLogin(dispatch),
    prepareCreate: (navigation: NativeStackNavigationProp<RootStackParamList>) =>
      prepareCreate(dispatch, navigation),
    createDisc: (data: string, navigation: NativeStackNavigationProp<RootStackParamList>,) => createDisc(dispatch, data, navigation),
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

  const { user, error, login, logout, prepareCreate, createDisc, navigation } = props

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response?.params
      login(id_token)
    }
  }, [response])

  const pickImage = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }).then((result) => {
      if (result.assets && result.assets.length > 0) {
        const image = result.assets[0]
        manipulateAsync(image.uri, [{ resize: { width: 600 } }], imageFormat).then((cropped) =>
          cropped.base64
            ? createDisc("data:image/jpg;base64," + cropped.base64, navigation)
            : console.log("Result has no base64 image"),
        )
      }
    })
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />
      {user &&
        <View>
          <Text style={styles.subtitle}>User details</Text>
          <Text>{user.username}</Text>
          <Text>{`${user.firstName} ${user.lastName} #${user.pdgaNumber}`}</Text>
          <Text>{user.email}</Text>
          {user.groups && user.groups.length > 0 &&
            <View>
              <Text style={styles.subtitle}>Groups</Text>
              {user.groups.map(group => <Text>{`\u2022 ${group.name}`}</Text> )}
            </View>
          }
        </View>
      }
      {user && <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />}
      {user && (
        <View style={styles.row}>
          <Text style={styles.subtitle}>New disc</Text>
          <TouchableOpacity style={styles.button} onPress={() => prepareCreate(navigation)}>
            <FontAwesome name="camera" color="white" size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
            <MaterialCommunityIcons name="view-gallery" color="white" size={25} />
          </TouchableOpacity>
        </View>
      )}
      {error && <Text>Error: {error}</Text>}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {user ? (
        <Button title="Logout" color="red" onPress={logout} />
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
  logo: {
    margin: 20
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 5
  },
  button: {
    margin: 20,
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.blue.dark,
    backgroundColor: Colors.blue.normal,
  },
  separator: {
    marginVertical: 30,
    height: 2,
    width: "80%",
  },
})
