import { setWebhook } from '@/bot'

const url = `${process.env.VERCEL_URL}/api/bot`
setWebhook(url)
  .then(() => console.log('Webhook set successfully'))
  .catch((err) => console.error('Error setting webhook:', err))
