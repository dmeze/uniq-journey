import { webhookCallback } from 'grammy'
import { bot } from '@/bot'
import { NextResponse } from 'next/server'

export async function POST() {
  webhookCallback(bot, 'std/http')
}

export async function GET() {
  return NextResponse.json({ status: 'Bot is running' })
}
