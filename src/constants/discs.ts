import { SaveFormat, SaveOptions } from "expo-image-manipulator"
import { IDisc } from "../types"

export const imagesUrl = "https://res.cloudinary.com/djc4j4dcs/"

export const discBasics = (disc: IDisc) => {
  return `${disc.mold.manufacturer.name} ${disc.plastic.name} ${disc.mold.name} ${disc.weight}g (${disc.color.name}) ${disc.condition}/10`
}

export const discStats = (disc: IDisc) => {
  return `${disc.mold.speed} / ${disc.mold.glide} / ${disc.mold.stability} / ${disc.mold.fade}`
}

export const imageFormat: SaveOptions = {
  compress: 0.8,
  format: SaveFormat.JPEG,
  base64: true,
}
