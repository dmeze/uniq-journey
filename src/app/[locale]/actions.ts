'use server'

import { cookies } from 'next/headers'
import { v4 } from 'uuid'

export async function create() {
  if (!cookies().has('uuid')) {
    const uuid = v4()
    const month = 30 * 24 * 60 * 60 * 1000
    cookies().set('uuid', uuid, { expires: Date.now() + month })
  }
}
