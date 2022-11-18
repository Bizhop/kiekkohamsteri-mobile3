import { FlatList, StyleSheet, ActivityIndicator } from "react-native"
import { Dispatch } from "redux"
import * as SecureStore from 'expo-secure-store'
import { ListItem, Avatar } from '@rneui/themed'

import * as discActions from "../components/discActions"
import { View, Text } from "../components/Themed"
import { IRootState } from "../store"
import { DiscActions, IDiscsState } from "../types"
import { connect } from "react-redux"

const imagesUrl = 'https://res.cloudinary.com/djc4j4dcs/'

const discBasics = (disc: any) => {
  return `${disc.valmistaja} ${disc.muovi} ${disc.mold} ${disc.paino}g (${disc.vari}) ${disc.kunto
    }/10`
}

const discStats = (disc: any) => {
  return `${disc.nopeus} / ${disc.liito} / ${disc.vakaus} / ${disc.feidi}`
}

const getDiscs = (dispatch: Dispatch) => {
  dispatch(discActions.prepareGet())
  SecureStore.getItemAsync("token").then(token => token && dispatch(discActions.get(token)))
}

const mapStateToProps = ({ discs }: IRootState): IDiscsState => {
  return discs
}

const mapDispatcherToProps = (dispatch: Dispatch<DiscActions>) => {
  return {
    getDiscs: getDiscs(dispatch)
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const keyExtractor = (_item: any, index: any) => index.toString()

const Disc = (props: { item: any }) => {
  const disc = props.item
  console.log(disc)

  return (
    <ListItem bottomDivider>
      <Avatar source={{ uri: `${imagesUrl}t_lista/${disc.kuva}` }} />
      <ListItem.Content>
        <ListItem.Title>{discBasics(disc)}</ListItem.Title>
        <ListItem.Subtitle>{discStats(disc)}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  )
}

const TabTwoScreen = (props: ReduxType) => {
  const { discs, loading } = props

  return (
    <View style={styles.container}>
      {loading
        ? <ActivityIndicator size="large" />
        : <FlatList keyExtractor={keyExtractor} data={discs} renderItem={Disc} />
      }
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
  }
})
