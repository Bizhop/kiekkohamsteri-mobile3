import * as React from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Camera, CameraPictureOptions, CameraType } from "expo-camera"
import { Button, StyleSheet, TouchableOpacity } from "react-native"
import { Dispatch } from "redux"
import * as SecureStore from "expo-secure-store"
import { FontAwesome } from "@expo/vector-icons"
import { connect } from "react-redux"

import { DiscActions } from "../types"
import { View, Text } from "../components/Themed"
import { RootStackParamList } from "../types"
import * as discActions from "../components/discActions"

const createDisc = (dispatch: Dispatch, disc: any) => {
  SecureStore.getItemAsync("token").then(
    (token) => token && dispatch(discActions.createDisc(token, disc)),
  )
}

const mapDispatcherToProps = (dispatch: Dispatch<DiscActions>) => {
  return {
    createDisc: (disc: any) => createDisc(dispatch, disc),
  }
}

type ReduxType = ReturnType<typeof mapDispatcherToProps> &
  NativeStackScreenProps<RootStackParamList>

const MyCamera = (props: ReduxType) => {
  const [type, setType] = React.useState(CameraType.back)
  const [permission, requestPermission] = Camera.useCameraPermissions()

  let camera: Camera | null

  if (!permission) {
    // Camera permissions are still loading
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    )
  }

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back))
  }

  const pictureOptions: CameraPictureOptions = {
    base64: true,
    quality: 1,
  }

  const takePicture = async () => {
    if (!camera) {
      alert("Camera not ready!")
      return
    }
    const image = await camera.takePictureAsync(pictureOptions)
    console.log(image)
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(r) => (camera = r)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <FontAwesome size={30} color="white" name="dot-circle-o" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <FontAwesome size={30} color="white" name="refresh" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )
}

export default connect(null, mapDispatcherToProps)(MyCamera)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
})
