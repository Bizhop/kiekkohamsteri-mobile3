import * as React from "react"
import { ActivityIndicator, StyleSheet, Image, Switch, ScrollView, TouchableOpacity, Alert } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Form, FormItem, Picker } from "react-native-form-component"
import * as SecureStore from "expo-secure-store"

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
} from "../types"
import * as DiscsConstants from "../constants/Discs"
import { assoc, omit, prop } from "ramda"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { FontAwesome } from "@expo/vector-icons"
import Colors from "../constants/Colors"

const mapStateToProps = (root: IRootState): IDiscsState & IDropdownsState => {
  return {
    ...root.discs,
    ...root.dropdowns,
  }
}

const getByManufacturerId = (dispatch: Dispatch, manufacturerId: number) => {
  SecureStore.getItemAsync("token").then(
    (token) => token && dispatch(dropdownActions.getByManufacturerId(manufacturerId, token)),
  )
}

const updateDisc = (
  dispatch: Dispatch,
  disc: any,
  id: number,
  navigation: NativeStackNavigationProp<RootTabParamList>,
) => {
  SecureStore.getItemAsync("token").then(
    (token) => token && dispatch(discActions.updateDisc(token, disc, id)),
  )
  navigation.navigate("TabTwo")
}

const deleteDisc = (dispatch: Dispatch, id: number, navigation: NativeStackNavigationProp<RootTabParamList>) => {
  SecureStore.getItemAsync("token").then(
    (token) => token && dispatch(discActions.deleteDisc(token, id)),
  )
  navigation.navigate("TabTwo")
}

const mapDispatcherToProps = (dispatch: Dispatch<DiscActions & DropdownActions>) => {
  return {
    updateDropdowns: (manufacturerId: number) => getByManufacturerId(dispatch, manufacturerId),
    updateDisc: (disc: any, id: number, navigation: NativeStackNavigationProp<RootTabParamList>) =>
      updateDisc(dispatch, disc, id, navigation),
    deleteDisc: (id: number, navigation: NativeStackNavigationProp<RootTabParamList>) => deleteDisc(dispatch, id, navigation)
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatcherToProps> &
  NativeStackScreenProps<RootTabParamList>

const DiscModalScreen = (props: ReduxType) => {
  const { discInEdit, dropdowns, selectedManufacturerId, updateDropdowns, navigation, updateDisc, deleteDisc } =
    props
  const { imagesUrl, discBasics, discStats } = DiscsConstants

  if (discInEdit && !selectedManufacturerId) {
    updateDropdowns(discInEdit.valmId)
  }

  const deleteDialog = (id: number) => {
    Alert.alert(
      "Delete disc",
      "Are you sure you want to delete this disc?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteDisc(id, navigation)
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      {discInEdit ? (
        <ScrollView>
          <Image style={styles.image} source={{ uri: `${imagesUrl}t_kiekko/${discInEdit.kuva}` }} />
          <Text style={styles.title}>{discBasics(discInEdit)}</Text>
          <Text>{discStats(discInEdit)}</Text>
          <DiscEditForm
            initialValues={discInEdit}
            dropdowns={dropdowns}
            updateDropdowns={updateDropdowns}
            updateDisc={(disc: any, id: number) => updateDisc(disc, id, navigation)}
          />
          <View style={styles.row}>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDialog(discInEdit.id)}>
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
  updateDisc: (disc: any, id: number) => void
}) => {
  const { initialValues, dropdowns, updateDropdowns, updateDisc } = props

  const [state, setState] = React.useState({
    valmId: initialValues.valmId,
    moldId: initialValues.moldId,
    muoviId: initialValues.muoviId,
    variId: initialValues.variId,
    paino: initialValues.paino.toString(),
    kunto: initialValues.kunto,
    hohto: initialValues.hohto,
    spessu: initialValues.spessu,
    dyed: initialValues.dyed,
    swirly: initialValues.swirly,
    tussit: initialValues.tussit,
    myynnissa: initialValues.myynnissa,
    hinta: initialValues.hinta.toString(),
    muuta: initialValues.muuta,
    loytokiekko: initialValues.loytokiekko,
    itb: initialValues.itb,
    publicDisc: initialValues.publicDisc,
    lost: initialValues.lost,
  })

  return (
    <Form
      onButtonPress={() => updateDisc(omit(["valmId"], state), initialValues.id)}
      buttonText="Update"
      buttonStyle={styles.submitButton}
    >
      <DropdownSelector
        label="Manufacturer"
        name="valmId"
        items={dropdowns.valms.map((manufacturer) => ({
          label: manufacturer.valmistaja,
          value: manufacturer.id,
        }))}
        state={state}
        setState={setState}
        updateDropdowns={updateDropdowns}
      />
      <DropdownSelector
        label="Mold"
        name="moldId"
        items={dropdowns.molds.map((mold) => ({ label: mold.kiekko, value: mold.id }))}
        state={state}
        setState={setState}
        updateDropdowns={() => { }}
      />
      <DropdownSelector
        label="Plastic"
        name="muoviId"
        items={dropdowns.muovit.map((plastic) => ({ label: plastic.muovi, value: plastic.id }))}
        state={state}
        setState={setState}
        updateDropdowns={() => { }}
      />
      <DropdownSelector
        label="Color"
        name="variId"
        items={dropdowns.varit.map((color) => ({ label: color.vari, value: color.id }))}
        state={state}
        setState={setState}
        updateDropdowns={() => { }}
      />
      <DropdownSelector
        label="Condition"
        name="kunto"
        items={dropdowns.kunto.map((condition) => ({ label: condition.nimi, value: condition.id }))}
        state={state}
        setState={setState}
        updateDropdowns={() => { }}
      />
      <DropdownSelector
        label="Markings"
        name="tussit"
        items={dropdowns.tussit.map((marking) => ({ label: marking.nimi, value: marking.id }))}
        state={state}
        setState={setState}
        updateDropdowns={() => { }}
      />
      <FormItem
        value={state.paino}
        label="Weight"
        onChangeText={(text) => setState({ ...state, paino: text })}
        onEndEditing={(e) =>
          updateState("paino", e.nativeEvent.text, initialValues, validateNumber, state, setState)
        }
      />
      <Checkbox label="Glow" name="hohto" state={state} setState={setState} />
      <Checkbox label="Special" name="spessu" state={state} setState={setState} />
      <Checkbox label="Dyed" name="dyed" state={state} setState={setState} />
      <Checkbox label="Swirly" name="swirly" state={state} setState={setState} />
      <Checkbox label="For sale" name="myynnissa" state={state} setState={setState} />
      {state.myynnissa && (
        <FormItem
          value={state.hinta}
          label="Price"
          onChangeText={(text) => setState({ ...state, hinta: text })}
          onEndEditing={(e) =>
            updateState("hinta", e.nativeEvent.text, initialValues, validateNumber, state, setState)
          }
        />
      )}
      <Checkbox label="Lost and found" name="loytokiekko" state={state} setState={setState} />
      <Checkbox label="Lost" name="lost" state={state} setState={setState} />
      <Checkbox label="In the bag" name="itb" state={state} setState={setState} />
      <Checkbox label="Public disc" name="publicDisc" state={state} setState={setState} />
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
      <Text style={styles.label}>{label}</Text>
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
      <Text style={styles.label}>{label}</Text>
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
  initialValues: IDisc,
  validator: (value: string) => boolean,
  state: any,
  setState: React.Dispatch<React.SetStateAction<any>>,
) => {
  if (validator(value)) {
    setState(assoc(name, value, state))
  } else {
    alert(`Input ${name} is not valid, resetting...`)
    const initialValue = prop(name, initialValues) || 0
    setState(assoc(name, initialValue.toString(), state))
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
})
