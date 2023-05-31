import { I18n } from "i18n-js/typings"
import { Alert } from "react-native"

const deleteDialog = (
  uuid: string,
  deleteDisc: (uuid: string, navigation: any) => void,
  i18n: I18n,
  navigation: any,
) => {
  Alert.alert(i18n.t("discs.delete.title"), i18n.t("discs.delete.subtitle"), [
    {
      text: i18n.t("discs.delete.cancel"),
      style: "cancel",
    },
    {
      text: i18n.t("discs.delete.confirm"),
      onPress: () => deleteDisc(uuid, navigation),
    },
  ])
}

export default deleteDialog
