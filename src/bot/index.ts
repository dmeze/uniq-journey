import { Bot } from 'grammy'

import { createAroma } from '@/app/actions/aroma/actions'

const allowedUserIds = JSON.parse(process.env.TELEGRAM_ALLOWED_IDS || '[]')

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN as string)

bot.command('start', async (ctx) => {
  if (!allowedUserIds.includes(ctx.from?.id!)) {
    await ctx.reply('You are not authorized to use this bot.')
    return
  }
  await ctx.reply('Welcome! Up and running.')
})

bot.command('addaroma', async (ctx) => {
  if (!allowedUserIds.includes(ctx.from?.id!)) {
    await ctx.reply('You are not authorized to use this bot.')
    return
  }

  const name = ctx.message?.text.split(' ').slice(1).join(' ')

  if (!name) {
    await ctx.reply(
      'Please provide a name for the aroma. Usage: /addaroma <name>',
    )
    return
  }

  const response = await createAroma(name as string)
  await ctx.reply(response.message)
})

bot.on('message', async (ctx) => {
  if (!allowedUserIds.includes(ctx.from?.id)) {
    await ctx.reply('You are not authorized to use this bot.')
    return
  }
  await ctx.reply('Got another message!')
})

export const setWebhook = async (url: string) => {
  await bot.api.setWebhook(url)
}
