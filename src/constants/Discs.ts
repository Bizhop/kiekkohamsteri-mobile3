export const imagesUrl = "https://res.cloudinary.com/djc4j4dcs/"

export const discBasics = (disc: any) => {
  return `${disc.valmistaja} ${disc.muovi} ${disc.mold} ${disc.paino}g (${disc.vari}) ${disc.kunto}/10`
}

export const discStats = (disc: any) => {
  return `${disc.nopeus} / ${disc.liito} / ${disc.vakaus} / ${disc.feidi}`
}
