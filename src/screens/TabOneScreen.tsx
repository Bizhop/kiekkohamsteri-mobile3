import * as React from "react"
import * as Google from "expo-auth-session/providers/google"
import { StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native"
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
import { imageFormat } from "../constants/discs"
import Colors from "../constants/Colors"
import { en, fi, logo } from "../assets/images"
import { i18n } from "../translations"

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

const createDisc = (
  dispatch: Dispatch,
  data: string,
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  SecureStore.getItemAsync("token").then(
    (token) => token && dispatch(discActions.createDisc(token, data)),
  )
  navigation.navigate("Disc")
}

const setConsent = (dispatch: Dispatch) => {
  SecureStore.setItemAsync("consent", "true").then(() => dispatch(homeActions.setConsent()))
}

const mapDispatcherToProps = (dispatch: Dispatch<HomeActions>) => {
  return {
    autoLogin: autoLogin(dispatch),
    prepareCreate: (navigation: NativeStackNavigationProp<RootStackParamList>) =>
      prepareCreate(dispatch, navigation),
    createDisc: (data: string, navigation: NativeStackNavigationProp<RootStackParamList>) =>
      createDisc(dispatch, data, navigation),
    login: (token: string) => dispatch(homeActions.login(token)),
    logout: () => dispatch(homeActions.logout()),
    setConsent: () => setConsent(dispatch),
    consentLoaded: (consent: string | null) => dispatch(homeActions.consentLoaded(consent)),
    setLanguage: (language: string) => dispatch(homeActions.setLanguage(language)),
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatcherToProps> &
  NativeStackScreenProps<RootStackParamList>

const LanguageSelector = (props: { setLanguage: (language: string) => void }) => (
  <View style={styles.row}>
    <TouchableOpacity onPress={() => props.setLanguage("fi")}>
      <Image style={styles.flag} source={fi} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => props.setLanguage("en")}>
      <Image style={styles.flag} source={en} />
    </TouchableOpacity>
  </View>
)

const TabOneScreen = (props: ReduxType) => {
  const [_request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: "368284396209-ein43uvg6fe6etku0fl464kcno7v66sp.apps.googleusercontent.com",
    androidClientId: "368284396209-9mdl024mu9bj3mpadovsk4le6uq8g5c8.apps.googleusercontent.com",
  })

  const {
    loadingConsent,
    consent,
    user,
    error,
    login,
    logout,
    prepareCreate,
    createDisc,
    setConsent,
    consentLoaded,
    setLanguage,
    navigation,
  } = props

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

  if (loadingConsent) {
    SecureStore.getItemAsync("consent").then((consent) => consentLoaded(consent))
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!consent) {
    return (
      <View style={styles.container}>
        <LanguageSelector setLanguage={setLanguage} />
        <Text style={styles.subtitle}>{i18n.t("home.consent.title")}</Text>
        <View style={styles.consent}>
          <Text>{`\u2022 ${i18n.t("home.consent.row1")}`}</Text>
          <Text>{`\u2022 ${i18n.t("home.consent.row2")}`}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setConsent()}>
          <Text darkColor="white" lightColor="white">
            {i18n.t("home.consent.button")}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LanguageSelector setLanguage={setLanguage} />
      <Image style={styles.logo} source={logo} />
      {user && (
        <View>
          <Text style={styles.subtitle}>{i18n.t("home.user.details")}</Text>
          <Text>{user.username}</Text>
          <Text>{`${user.firstName} ${user.lastName} #${user.pdgaNumber}`}</Text>
          <Text>{user.email}</Text>
          {user.groups && user.groups.length > 0 && (
            <View>
              <Text style={styles.subtitle}>{i18n.t("home.user.groups")}</Text>
              {user.groups.map((group) => (
                <Text key={`group-${group.id}`}> {`\u2022 ${group.name}`}</Text>
              ))}
            </View>
          )}
        </View>
      )}
      {user && (
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      )}
      {user && (
        <View style={styles.row}>
          <Text style={styles.subtitle}>{i18n.t("discs.new")}</Text>
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
        <TouchableOpacity style={styles.redButton} onPress={() => logout()}>
          <MaterialCommunityIcons name="logout" color="white" size={25} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
          <FontAwesome name="google" color="white" size={25} />
        </TouchableOpacity>
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
    margin: 20,
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
    marginVertical: 5,
  },
  button: {
    margin: 20,
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.blue.dark,
    backgroundColor: Colors.blue.normal,
  },
  redButton: {
    margin: 20,
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.red.dark,
    backgroundColor: Colors.red.normal,
  },
  separator: {
    marginVertical: 30,
    height: 2,
    width: "80%",
  },
  consent: {
    margin: 20,
  },
  flag: {
    height: 25,
    width: 35,
    borderWidth: 1,
    borderColor: "black",
    margin: 20,
  },
})
