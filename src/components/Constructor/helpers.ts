import { colorsMap } from '@/components/Constructor/constants'

export const isDarkColor = (color: string) => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 180
}

export const getLabels = (
  name: string,
  baseNotes: string[],
  middleNotes: string[],
  topNotes: string[],
) => {
  const labels = []
  if (baseNotes.includes(name)) labels.push('B')
  if (middleNotes.includes(name)) labels.push('M')
  if (topNotes.includes(name)) labels.push('T')
  return labels
}

export const getColorMap = (
  baseNotes: string[],
  middleNotes: string[],
  topNotes: string[],
) => {
  const colorMap = new Map<string, string>()
  const allNotes = [...baseNotes, ...middleNotes, ...topNotes]

  allNotes.forEach((aroma) => {
    if (!colorMap.has(aroma)) {
      colorMap.set(aroma, colorsMap[colorMap.size % colorsMap.length])
    }
  })

  return colorMap
}
