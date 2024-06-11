import { webhookCallback } from 'grammy'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { bot } from '@/bot'

export const POST = async (request: NextRequest) => {
  const handler = webhookCallback(bot, 'std/http')
  return handler(request)
}

export async function GET() {
  return NextResponse.json({ status: 'Bot is running' })
}
