import * as React from "react"
import { StyleSheet, ActivityIndicator, FlatList } from "react-native"
import { Dispatch } from "redux"
import * as SecureStore from "expo-secure-store"
import { ListItem, Avatar } from "@rneui/themed"

import * as discActions from "../components/discActions"
import * as DiscsConstants from "../constants/discs"
import { View } from "../components/Themed"
import { IRootState } from "../store"
import { DiscActions, IDisc, IPagination, ISort, RootStackParamList } from "../types"
import { connect } from "react-redux"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import Colors from "../constants/Colors"
import { defaultSort, defaultPagination } from "../constants/discs"
import AccessCheck from "./AccessCheck"
import deleteDialog from "./deleteDialog"
import { i18n } from "../translations"

const getDiscs = (dispatch: Dispatch, sort: ISort, pagination: IPagination) => {
  dispatch(discActions.prepareGet())
  SecureStore.getItemAsync("token")
    .then((token) => token && dispatch(discActions.get(sort, pagination, token)))
    .catch((error) => console.log(error))
}

const getNextPage = (dispatch: Dispatch, sort: ISort, pagination: IPagination) => {
  SecureStore.getItemAsync("token")
    .then((token) => token && dispatch(discActions.getNextPage(sort, pagination, token)))
    .catch((error) => console.log(error))
}

const openEdit = (
  dispatch: Dispatch,
  index: number,
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  dispatch(discActions.prepareEdit(index))
  navigation.navigate("Disc")
}

const deleteDisc = (dispatch: Dispatch, uuid: string) => {
  SecureStore.getItemAsync("token")
    .then((token) => token && dispatch(discActions.deleteDisc(token, uuid)))
    .catch((error) => console.log(error))
}

const mapStateToProps = (root: IRootState): IRootState => {
  return root
}

const mapDispatcherToProps = (dispatch: Dispatch<DiscActions>) => {
  return {
    getDiscs: (sort: ISort, pagination: IPagination) => getDiscs(dispatch, sort, pagination),
    getNextPage: (sort: ISort, pagination: IPagination) => getNextPage(dispatch, sort, pagination),
    openEdit: (index: number, navigation: NativeStackNavigationProp<RootStackParamList>) =>
      openEdit(dispatch, index, navigation),
    deleteDisc: (uuid: string, _navigation: any) => deleteDisc(dispatch, uuid),
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatcherToProps> &
  NativeStackScreenProps<RootStackParamList>

const TabTwoScreen = (props: ReduxType) => {
  const [ nextPage, setNextPage ] = React.useState(1)
  const [ refreshing, setRefreshing ] = React.useState(false)

  React.useEffect(() => {
    loadInitialDiscs()
  }, [])

  const { discs, loading, lastPage } = props.discs
  const { user, consent } = props.home
  const { navigation, openEdit, deleteDisc } = props

  const loadInitialDiscs = () => {
    setRefreshing(true)
    props.getDiscs(defaultSort, defaultPagination)
    setNextPage(1)
    setRefreshing(false)
  }

  const loadNextPage = () => {
    if (lastPage) return

    props.getNextPage(defaultSort, { ...defaultPagination, number: nextPage })
    setNextPage(currentValue => currentValue + 1)
  }

  if (!user || !consent) {
    return <AccessCheck user={user} consent={consent} />
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          keyExtractor={(_item, index) => index.toString()}
          data={discs}
          renderItem={({ item, index }) => (
            <Disc
              disc={item}
              index={index}
              openEdit={openEdit}
              navigation={navigation}
              deleteDisc={deleteDisc}
            />
          )}
          initialNumToRender={defaultPagination.size}
          onEndReached={() => loadNextPage()}
          onEndReachedThreshold={0.1}
          refreshing={refreshing}
          onRefresh={() => loadInitialDiscs()}
        />
      )}
    </View>
  )
}

const Disc = ({ disc, index, openEdit, navigation, deleteDisc }: {
  disc: IDisc,
  index: number,
  openEdit: (index: number, navigation: NativeStackNavigationProp<RootStackParamList>) => any,
  navigation: NativeStackNavigationProp<RootStackParamList>,
  deleteDisc: (uuid: string, _navigation: any) => any
}) => {
  const { imagesUrl, discBasics, discStats } = DiscsConstants

  return (
    <ListItem bottomDivider onPress={() => openEdit(index, navigation)}>
      <Avatar source={{ uri: `${imagesUrl}t_lista/${disc.image}` }} />
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
        onPress={() => deleteDialog(disc.uuid, deleteDisc, i18n, navigation)}
      />
    </ListItem>
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
