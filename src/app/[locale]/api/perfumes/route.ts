import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM perfumes;`

    return Response.json(rows)
  } catch (e) {
    return Response.json(e)
  }
}
