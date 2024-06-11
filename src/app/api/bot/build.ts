import { bot } from '@/bot'

bot.api.setWebhook(`${process.env.VERCEL_URL}/api/bot`)
