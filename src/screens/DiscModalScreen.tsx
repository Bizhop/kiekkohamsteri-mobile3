import * as React from "react"
import {
  ActivityIndicator,
  StyleSheet,
  Image,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Form, FormItem, Picker } from "react-native-form-component"
import * as SecureStore from "expo-secure-store"
import * as ImagePicker from "expo-image-picker"
import { manipulateAsync } from "expo-image-manipulator"

import * as dropdownActions from "../components/dropdownActions"
import * as discActions from "../components/discActions"
import { View, Text } from "../components/Themed"
import { IRootState } from "../store"
import {
  DiscActions,
  DropdownActions,
  IDisc,
  IDiscsState,
  IDropdownsState,
  IDropdowns,
  RootTabParamList,
  IDiscUpdate,
} from "../types"
import * as DiscsConstants from "../constants/discs"
import { assoc, omit, prop } from "ramda"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import Colors from "../constants/Colors"
import { i18n } from "../translations"
import deleteDialog from "./deleteDialog"
import { RootStackParamList } from "../types"
import { imageFormat } from "../constants/discs"

const mapStateToProps = (root: IRootState): IDiscsState & IDropdownsState => {
  return {
    ...root.discs,
    ...root.dropdowns,
  }
}

const getByManufacturerId = (dispatch: Dispatch, manufacturerId: number) => {
  SecureStore.getItemAsync("token")
    .then((token) => token && dispatch(dropdownActions.getByManufacturerId(manufacturerId, token)))
    .catch((error) => console.log(error))
}

const updateDisc = (
  dispatch: Dispatch,
  disc: any,
  uuid: string,
  navigation: NativeStackNavigationProp<RootTabParamList>,
) => {
  SecureStore.getItemAsync("token")
    .then((token) => token && dispatch(discActions.updateDisc(token, disc, uuid)))
    .catch((error) => console.log(error))
  navigation.navigate("TabTwo")
}

const deleteDisc = (
  dispatch: Dispatch,
  uuid: string,
  navigation: NativeStackNavigationProp<RootTabParamList>,
) => {
  SecureStore.getItemAsync("token")
    .then((token) => token && dispatch(discActions.deleteDisc(token, uuid)))
    .catch((error) => console.log(error))
  navigation.navigate("TabTwo")
}

const updateImage = (dispatch: Dispatch, data: string, uuid: string) => {
  SecureStore.getItemAsync("token")
    .then((token) => token && dispatch(discActions.updateImage(token, data, uuid)))
    .catch((error) => console.log(error))
}

const mapDispatcherToProps = (dispatch: Dispatch<DiscActions & DropdownActions>) => {
  return {
    updateDropdowns: (manufacturerId: number) => getByManufacturerId(dispatch, manufacturerId),
    updateDisc: (disc: any, uuid: string, navigation: NativeStackNavigationProp<RootTabParamList>) =>
      updateDisc(dispatch, disc, uuid, navigation),
    deleteDisc: (uuid: string, navigation: NativeStackNavigationProp<RootTabParamList>) =>
      deleteDisc(dispatch, uuid, navigation),
    updateImage: (data: string, uuid: string) => updateImage(dispatch, data, uuid)
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatcherToProps> &
  NativeStackScreenProps<RootTabParamList> &
  NativeStackScreenProps<RootStackParamList>

const DiscModalScreen = (props: ReduxType) => {
  const {
    discInEdit,
    dropdowns,
    selectedManufacturerId,
    updateDropdowns,
    navigation,
    updateDisc,
    deleteDisc,
    updateImage
  } = props
  const { imagesUrl, discBasics, discStats } = DiscsConstants

  if (discInEdit && !selectedManufacturerId) {
    updateDropdowns(discInEdit.mold.manufacturer.id)
  }

  const pickImage = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
      .then((result) => {
        if (result.assets && result.assets.length > 0) {
          const image = result.assets[0]
          manipulateAsync(image.uri, [{ resize: { width: 600 } }], imageFormat)
            .then((cropped) => {
              if (!cropped.base64) {
                console.log("Result has no base64 image")
                return
              }
              if (!discInEdit) {
                console.log("No disc in edit")
                return
              }

              updateImage("data:image/jpg;base64," + cropped.base64, discInEdit.uuid)
              navigation.navigate("Disc")
            })
            .catch((error) => console.log(error))
        }
      })
      .catch((error) => console.log(error))
  }

  return (
    <View style={styles.container}>
      {discInEdit ? (
        <ScrollView>
          <Image
            style={styles.image}
            source={{ uri: `${imagesUrl}t_kiekko/${discInEdit.image}` }}
          />
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => navigation.navigate("Camera")}
            >
              <FontAwesome name="camera" color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton} onPress={() => pickImage()}>
              <MaterialCommunityIcons name="view-gallery" color="white" size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{discBasics(discInEdit)}</Text>
          <Text>{discStats(discInEdit)}</Text>
          <DiscEditForm
            initialValues={discInEdit}
            dropdowns={dropdowns}
            updateDropdowns={updateDropdowns}
            updateDisc={(disc: any, uuid: string) => updateDisc(disc, uuid, navigation)}
          />
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteDialog(discInEdit.uuid, deleteDisc, i18n, navigation)}
            >
              <FontAwesome name="trash" color="white" size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  )
}

const DiscEditForm = (props: {
  initialValues: IDisc
  dropdowns: IDropdowns
  updateDropdowns: (manufacturerId: number) => void
  updateDisc: (disc: IDiscUpdate, uuid: string) => void
}) => {
  const { initialValues, dropdowns, updateDropdowns, updateDisc } = props

  const [state, setState] = React.useState({
    manufacturerId: initialValues.mold.manufacturer.id,
    moldId: initialValues.mold.id,
    plasticId: initialValues.plastic.id,
    colorId: initialValues.color.id,
    weight: initialValues.weight,
    condition: initialValues.condition,
    glow: initialValues.glow,
    special: initialValues.special,
    dyed: initialValues.dyed,
    swirly: initialValues.swirly,
    markings: initialValues.markings,
    forSale: initialValues.forSale,
    price: initialValues.price,
    description: initialValues.description,
    lostAndFound: initialValues.lostAndFound,
    itb: initialValues.itb,
    publicDisc: initialValues.publicDisc,
    lost: initialValues.lost,
  })

  const [textWeight, setTextWeight] = React.useState(initialValues.weight.toString())
  const [textPrice, setTextPrice] = React.useState(initialValues.price.toString())

  return (
    <Form
      onButtonPress={() => updateDisc(omit(["manufacturerId"], state), initialValues.uuid)}
      buttonText={i18n.t("discs.update.button")}
      buttonStyle={styles.submitButton}
    >
      <DropdownSelector
        label="discs.update.manufacturer"
        name="manufacturerId"
        items={dropdowns.manufacturers.map((manufacturer) => ({
          label: manufacturer.name,
          value: manufacturer.value,
        }))}
        state={state}
        setState={setState}
        updateDropdowns={updateDropdowns}
      />
      <DropdownSelector
        label="discs.update.mold"
        name="moldId"
        items={dropdowns.molds.map((mold) => ({ label: mold.name, value: mold.value }))}
        state={state}
        setState={setState}
        updateDropdowns={() => { }}
      />
      <DropdownSelector
        label="discs.update.plastic"
        name="plasticId"
        items={dropdowns.plastics.map((plastic) => ({ label: plastic.name, value: plastic.value }))}
        state={state}
        setState={setState}
        updateDropdowns={() => { }}
      />
      <DropdownSelector
        label="discs.update.color"
        name="colorId"
        items={dropdowns.colors.map((color) => ({ label: color.name, value: color.value }))}
        state={state}
        setState={setState}
        updateDropdowns={() => { }}
      />
      <DropdownSelector
        label="discs.update.condition"
        name="condition"
        items={dropdowns.conditions.map((condition) => ({
          label: condition.name,
          value: condition.value,
        }))}
        state={state}
        setState={setState}
        updateDropdowns={() => { }}
      />
      <DropdownSelector
        label="discs.update.markings"
        name="markings"
        items={dropdowns.markings.map((marking) => ({ label: marking.name, value: marking.value }))}
        state={state}
        setState={setState}
        updateDropdowns={() => { }}
      />
      <FormItem
        value={textWeight}
        label={i18n.t("discs.update.weight")}
        onChangeText={setTextWeight}
        onEndEditing={(e) =>
          updateState(
            "weight",
            e.nativeEvent.text,
            state.weight.toString(),
            validateNumber,
            state,
            setState,
            setTextWeight,
          )
        }
      />
      <Checkbox label="discs.update.glow" name="glow" state={state} setState={setState} />
      <Checkbox label="discs.update.special" name="special" state={state} setState={setState} />
      <Checkbox label="discs.update.dyed" name="dyed" state={state} setState={setState} />
      <Checkbox label="discs.update.swirly" name="swirly" state={state} setState={setState} />
      <Checkbox label="discs.update.forSale" name="forSale" state={state} setState={setState} />
      {state.forSale && (
        <FormItem
          value={textPrice}
          label={i18n.t("discs.update.price")}
          onChangeText={setTextPrice}
          onEndEditing={(e) =>
            updateState(
              "price",
              e.nativeEvent.text,
              state.price.toString(),
              validateNumber,
              state,
              setState,
              setTextPrice,
            )
          }
        />
      )}
      <Checkbox
        label="discs.update.lostAndFound"
        name="loytokiekko"
        state={state}
        setState={setState}
      />
      <Checkbox label="discs.update.lost" name="lost" state={state} setState={setState} />
      <Checkbox label="discs.update.itb" name="itb" state={state} setState={setState} />
      <Checkbox
        label="discs.update.publicDisc"
        name="publicDisc"
        state={state}
        setState={setState}
      />
    </Form>
  )
}

const Checkbox = (props: {
  label: string
  name: string
  state: any
  setState: React.Dispatch<React.SetStateAction<any>>
}) => {
  const { label, name, state, setState } = props

  return (
    <View style={styles.inputRow}>
      <Text style={styles.label}>{i18n.t(label)}</Text>
      <View style={styles.checkbox}>
        <Switch
          value={prop(name, state)}
          onValueChange={(value) => setState(assoc(name, value, state))}
        />
      </View>
    </View>
  )
}

const DropdownSelector = (props: {
  label: string
  name: string
  items: any[]
  state: any
  setState: React.Dispatch<React.SetStateAction<any>>
  updateDropdowns: (manufacturerId: number) => void
}) => {
  const { label, name, items, state, setState, updateDropdowns } = props

  return (
    <View style={styles.inputRow}>
      <Text style={styles.label}>{i18n.t(label)}</Text>
      <Picker
        type="modal"
        selectedValue={prop(name, state)}
        items={items}
        onSelection={(item: any) => {
          updateDropdowns(item.value)
          setState(assoc(name, item.value, state))
        }}
      />
    </View>
  )
}

const updateState = (
  name: string,
  value: string,
  initialValue: string,
  validator: (value: string) => boolean,
  state: any,
  setState: React.Dispatch<React.SetStateAction<any>>,
  setTextFunction: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (validator(value)) {
    setState(assoc(name, value, state))
    setTextFunction(parseInt(value).toString())
  } else {
    setTextFunction(initialValue)
  }
}

const validateNumber = (value: string): boolean => {
  return Number.isInteger(parseInt(value))
}

export default connect(mapStateToProps, mapDispatcherToProps)(DiscModalScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    width: "90%",
    height: undefined,
    aspectRatio: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    flex: 1,
  },
  checkbox: {
    flex: 4,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  submitButton: {
    margin: 20,
    padding: 10,
    backgroundColor: Colors.blue.normal,
  },
  deleteButton: {
    margin: 20,
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.red.dark,
    backgroundColor: Colors.red.normal,
  },
  cameraButton: {
    margin: 20,
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.blue.dark,
    backgroundColor: Colors.blue.normal,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
})
