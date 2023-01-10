import * as React from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Camera, CameraPictureOptions, CameraType } from "expo-camera"
import { Button, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native"
import { Dispatch } from "redux"
import * as SecureStore from "expo-secure-store"
import { FontAwesome } from "@expo/vector-icons"
import { connect } from "react-redux"
import { manipulateAsync, SaveFormat } from "expo-image-manipulator"

import { DiscActions, IDiscsState } from "../types"
import { View, Text } from "../components/Themed"
import { RootStackParamList } from "../types"
import * as discActions from "../components/discActions"
import { IRootState } from "../store"
import { imageFormat } from "../constants/discs"

const mapStateToProps = ({ discs }: IRootState): IDiscsState => {
  return discs
}

const createDisc = (dispatch: Dispatch, data: string) => {
  SecureStore.getItemAsync("token")
    .then((token) => token && dispatch(discActions.createDisc(token, data)))
    .catch((error) => console.log(error))
}

const mapDispatcherToProps = (dispatch: Dispatch<DiscActions>) => {
  return {
    createDisc: (data: string) => createDisc(dispatch, data),
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatcherToProps> &
  NativeStackScreenProps<RootStackParamList>

const MyCamera = (props: ReduxType) => {
  const { createDisc, discInEdit, navigation } = props

  const { width } = useWindowDimensions()
  const height = Math.round((width * 4) / 3)
  const [type, setType] = React.useState(CameraType.back)
  const [permission, requestPermission] = Camera.useCameraPermissions()

  let camera: Camera | null

  if (discInEdit) {
    navigation.navigate("Disc")
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Request permission" />
      </View>
    )
  }

  const toggleCameraType = () =>
    setType(type === CameraType.back ? CameraType.front : CameraType.back)

  const resizeAndCrop = (imageUri: string) => {
    camera?.pausePreview()
    //image should be 800x600 (4:3) after resize
    manipulateAsync(
      imageUri,
      [{ resize: { width: 600 } }, { crop: { originX: 0, originY: 100, width: 600, height: 600 } }],
      imageFormat,
    )
      .then((cropped) =>
        cropped.base64
          ? createDisc("data:image/jpg;base64," + cropped.base64)
          : console.log("Result has no base64 image"),
      )
      .catch((error) => console.log(error))
  }

  const pictureOptions: CameraPictureOptions = {
    quality: 1,
  }

  const takePicture = () => {
    if (!camera) {
      alert("Camera not ready!")
      return
    }

    camera
      .takePictureAsync(pictureOptions)
      .then((photo) => resizeAndCrop(photo.uri))
      .catch((error) => console.log(error))
  }

  return (
    <View style={styles.container}>
      <Camera
        style={{ alignSelf: "flex-start", height: height, width: width }}
        type={type}
        ref={(r) => (camera = r)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <FontAwesome size={30} color="white" name="dot-circle-o" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <FontAwesome size={30} color="white" name="refresh" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default connect(mapStateToProps, mapDispatcherToProps)(MyCamera)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "black",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    backgroundColor: "transparent",
    margin: 60,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
})
