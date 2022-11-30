import { Dict, I18n } from "i18n-js"
import { any, equals } from "ramda"

export const defaultLanguage = "fi"

const translations: Dict = {
  en: {
    home: {
      title: "Home",
      consent: {
        title: "Consent Requirement",
        row1: "Kiekkohamsteri collects and saves your email address from Google Login. Purpose of collection is user account management.",
        row2: "Kiekkohamsteri collects and saves pictures you submit with this application. Purpose if collection is application functionality.",
        button: "Agree",
        remove: "Remove consent",
        noConsent: "You need to agree consent",
      },
      user: {
        details: "User details",
        groups: "Groups",
        edit: "Edit user details",
        username: "Username",
        firstName: "First name",
        lastName: "Last name",
        pdgaNumber: "PDGA number",
        update: "Update",
        notLoggedIn: "You're not logged in",
      },
    },
    discs: {
      title: "Discs",
      new: "New disc",
      delete: {
        title: "Delete disc",
        subtitle: "Are you sure you want to delete this disc?",
        cancel: "Cancel",
        confirm: "Delete",
      },
      update: {
        button: "Update",
        manufacturer: "Manufacturer",
        mold: "Mold",
        plastic: "Plastic",
        color: "Color",
        condition: "Condition",
        markings: "Markings",
        weight: "Weight",
        glow: "Glow",
        special: "Special",
        dyed: "Dyed",
        swirly: "Swirly",
        forSale: "For sale",
        price: "Price",
        lostAndFound: "Lost and found",
        lost: "Lost",
        itb: "In the bag",
        publicDisc: "Public disc",
      },
    },
  },
  fi: {
    home: {
      title: "Etusivu",
      consent: {
        title: "Suostumusvaatimus",
        row1: "Kiekkohamsteri kerää ja tallentaa sähköpostiosoitteesi Googlen kirjautumisen kautta. Keräämisen tarkoituksena on käyttäjätietojen hallinta.",
        row2: "Kiekkohamsteri kerää ja tallentaa sovelluksen kautta lähettämäsi valokuvat. Keräämisen tarkoituksena on tarkoituksena sovelluksen toiminnallisuus.",
        button: "Hyväksy",
        remove: "Poista suostumusten hyväksyntä",
        noConsent: "Et ole hyväksynyt suostumusvaatimusta",
      },
      user: {
        details: "Käyttäjätiedot",
        groups: "Ryhmät",
        edit: "Muokkaa käyttäjän tietoja",
        username: "Käyttäjänimi",
        firstName: "Etunimi",
        lastName: "Sukunimi",
        pdgaNumber: "PDGA numero",
        update: "Päivitä",
        notLoggedIn: "Et ole kirjautunut",
      },
    },
    discs: {
      title: "Kiekot",
      new: "Uusi kiekko",
      delete: {
        title: "Poista kiekko",
        subtitle: "Haluatko varmasti poistaa tämän kiekon?",
        cancel: "Peruuta",
        confirm: "Poista",
      },
      update: {
        button: "Päivitä",
        manufacturer: "Valmistaja",
        mold: "Mold",
        plastic: "Muovi",
        color: "Väri",
        condition: "Kunto",
        markings: "Tussit",
        weight: "Paino",
        glow: "Glow",
        special: "Spessu",
        dyed: "Dyed",
        swirly: "Swirly",
        forSale: "Myynnissä",
        price: "Hinta",
        lostAndFound: "Löytökiekko",
        lost: "Kadonnut",
        itb: "Bägissä",
        publicDisc: "Julkinen kiekko",
      },
    },
  },
}

const supportedLanguages = ["fi", "en"]

export const i18n = new I18n(translations)
i18n.locale = defaultLanguage

export const setLanguage = (languageCode: string) => {
  if (any(equals(languageCode))(supportedLanguages)) {
    i18n.locale = languageCode
  }
}
