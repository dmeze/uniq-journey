import { setWebhook } from '@/bot'

const url = `${process.env.VERCEL_URL}/api/bot`
setWebhook(url)
