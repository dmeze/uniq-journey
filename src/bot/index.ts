import { Bot } from 'grammy'

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN as string)

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))
bot.on('message', (ctx) => ctx.reply('Got another message!'))

export const setWebhook = async (url: string) => {
  await bot.api.setWebhook(url)
}
