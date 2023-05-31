import { SaveFormat, SaveOptions } from "expo-image-manipulator"
import { IDisc, IPagination, ISort } from "../types"

export const imagesUrl = "https://res.cloudinary.com/djc4j4dcs/"

export const discBasics = (disc: IDisc): string => {
  return `${disc.mold.manufacturer.name} ${disc.plastic.name} ${disc.mold.name} ${disc.weight}g (${disc.color.name}) ${disc.condition}/10`
}

export const discStats = (disc: IDisc): string => {
  return `${disc.mold.speed} / ${disc.mold.glide} / ${disc.mold.stability} / ${disc.mold.fade}`
}

export const imageFormat: SaveOptions = {
  compress: 0.8,
  format: SaveFormat.JPEG,
  base64: true,
}

export const defaultSort: ISort = {
  sort: "mold.manufacturer.name,asc&sort=mold.speed,asc&sort=mold.name,asc&sort=plastic.name,asc",
  column: "Valmistaja",
}

export const defaultPagination: IPagination = {
  number: 0,
  size: 12,
}
