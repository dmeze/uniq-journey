import prisma from '@/app/actions'

export const getPerfumes = async () => {
  return prisma.perfume.findMany()
}
