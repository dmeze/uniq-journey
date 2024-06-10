import type { Perfume } from '@/app/actions/aroma/actions'

export const filterPerfumes = (
  perfumes: Perfume[],
  selectedAromas: Set<string>,
  currentPerfumeId: string,
): Perfume[] => {
  return perfumes.filter(
    (perfume) =>
      perfume.id !== currentPerfumeId &&
      Array.from(selectedAromas).every((name) =>
        perfume.aromas.some((a) => a.aroma.name === name),
      ),
  )
}

export const countSimilarAromas = (
  perfumes: Perfume[],
): Record<string, number> => {
  return perfumes.reduce(
    (acc, perfume) => {
      perfume.aromas.forEach(({ aroma: aromaFilter }) => {
        acc[aromaFilter.name] = (acc[aromaFilter.name] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )
}
