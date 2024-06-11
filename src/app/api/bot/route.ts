import { Bot, webhookCallback } from 'grammy'

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN as string)

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))
bot.on('message', (ctx) => ctx.reply('Got another message!'))

export async function POST() {
  return webhookCallback(bot, 'std/http')
}
