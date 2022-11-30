import * as React from "react"
import { StyleSheet, ActivityIndicator } from "react-native"
import { Dispatch } from "redux"
import * as SecureStore from "expo-secure-store"
import { ListItem, Avatar } from "@rneui/themed"

import * as discActions from "../components/discActions"
import * as DiscsConstants from "../constants/discs"
import { View } from "../components/Themed"
import { IRootState } from "../store"
import { DiscActions, IDisc, RootStackParamList } from "../types"
import { connect } from "react-redux"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import Colors from "../constants/Colors"
import AccessCheck from "./AccessCheck"
import deleteDialog from "./deleteDialog"
import { i18n } from "../translations"

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
  SecureStore.getItemAsync("token").then(
    (token) => token && dispatch(discActions.deleteDisc(token, id)),
  )
}

const mapStateToProps = (root: IRootState): IRootState => {
  return root
}

const mapDispatcherToProps = (dispatch: Dispatch<DiscActions>) => {
  return {
    getDiscs: getDiscs(dispatch),
    openEdit: (index: number, navigation: NativeStackNavigationProp<RootStackParamList>) =>
      openEdit(dispatch, index, navigation),
    deleteDisc: (id: number, _navigation: any) => deleteDisc(dispatch, id),
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatcherToProps> &
  NativeStackScreenProps<RootStackParamList>

const TabTwoScreen = (props: ReduxType) => {
  const { discs, loading } = props.discs
  const { user, consent } = props.home
  const { navigation, openEdit, deleteDisc } = props
  const { imagesUrl, discBasics, discStats } = DiscsConstants

  if (!user || !consent) {
    return <AccessCheck user={user} consent={consent} />
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
            <ListItem.Chevron
              style={styles.deleteButton}
              color="white"
              type="font-awesome"
              name="trash"
              size={20}
              onPress={() => deleteDialog(disc.id, deleteDisc, i18n, navigation)}
            />
          </ListItem>
        ))
      )}
    </View>
  )
}

export default connect(mapStateToProps, mapDispatcherToProps)(TabTwoScreen)

const styles = StyleSheet.create({
  defaultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
