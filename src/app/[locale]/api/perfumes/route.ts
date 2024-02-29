import prisma from '@/app/[locale]/api'

export async function GET() {
  try {
    const perfumes = await prisma.perfume.findMany()

    return Response.json(perfumes)
  } catch (e) {
    return Response.json(e)
  }
}
