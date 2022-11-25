import { StyleSheet, ActivityIndicator, Alert } from "react-native"
import { Dispatch } from "redux"
import * as SecureStore from "expo-secure-store"
import { ListItem, Avatar } from "@rneui/themed"

import * as discActions from "../components/discActions"
import * as DiscsConstants from "../constants/Discs"
import { View } from "../components/Themed"
import { IRootState } from "../store"
import { DiscActions, IDisc, IDiscsState, RootStackParamList } from "../types"
import { connect } from "react-redux"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import Colors from "../constants/Colors"

const getDiscs = (dispatch: Dispatch) => {
  dispatch(discActions.prepareGet())
  SecureStore.getItemAsync("token").then((token) => token && dispatch(discActions.get(token)))
}

const openEdit = (
  dispatch: Dispatch,
  index: number,
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  dispatch(discActions.prepareEdit(index))
  navigation.navigate("Disc")
}

const deleteDisc = (dispatch: Dispatch, id: number) => {
  SecureStore.getItemAsync("token").then((token) => token && dispatch(discActions.deleteDisc(token, id)))
}

const mapStateToProps = ({ discs }: IRootState): IDiscsState => {
  return discs
}

const mapDispatcherToProps = (dispatch: Dispatch<DiscActions>) => {
  return {
    getDiscs: getDiscs(dispatch),
    openEdit: (index: number, navigation: NativeStackNavigationProp<RootStackParamList>) =>
      openEdit(dispatch, index, navigation),
    deleteDisc: (id: number) => deleteDisc(dispatch, id)
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatcherToProps> &
  NativeStackScreenProps<RootStackParamList>

const TabTwoScreen = (props: ReduxType) => {
  const { discs, loading, navigation, openEdit, deleteDisc } = props
  const { imagesUrl, discBasics, discStats } = DiscsConstants

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
          onPress: () => deleteDisc(id)
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        discs.map((disc: IDisc, index: number) => (
          <ListItem bottomDivider key={disc.id} onPress={() => openEdit(index, navigation)}>
            <Avatar source={{ uri: `${imagesUrl}t_lista/${disc.kuva}` }} />
            <ListItem.Content>
              <ListItem.Title>{discBasics(disc)}</ListItem.Title>
              <ListItem.Subtitle>{discStats(disc)}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron style={styles.deleteButton} color="white" type="font-awesome" name="trash" size={20} onPress={() => deleteDialog(disc.id)} />
          </ListItem>
        ))
      )}
    </View>
  )
}

export default connect(mapStateToProps, mapDispatcherToProps)(TabTwoScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: Colors.red.dark,
    backgroundColor: Colors.red.normal,
  },
})
