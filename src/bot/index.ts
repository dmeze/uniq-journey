import type { Context } from 'grammy'
import { Bot, session } from 'grammy'
import type { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { conversations, createConversation } from '@grammyjs/conversations'

import { addPerfumeConversation } from '@/bot/commands/addPerfume'
import { addAroma } from '@/bot/commands/addAroma'
import { updateOrderStatusConversation } from '@/bot/commands/listOrders'

export const allowedUserIds = JSON.parse(
  process.env.TELEGRAM_ALLOWED_IDS || '[]',
)

export type MyContext = Context & ConversationFlavor
export type MyConversation = Conversation<MyContext>

export const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_TOKEN as string)

bot.use(
  session({
    initial() {
      return {}
    },
  }),
)

bot.use(conversations())

bot.command('start', async (ctx) => {
  if (!allowedUserIds.includes(ctx.from?.id!)) {
    await ctx.reply('You are not authorized to use this bot.')
    return
  }
  await ctx.reply('Welcome! Up and running.')
})

bot.command('addaroma', (ctx) => addAroma(ctx, allowedUserIds))

bot.use(createConversation(addPerfumeConversation, 'add-perfume'))

bot.command('addperfume', async (ctx) => {
  if (!allowedUserIds.includes(ctx.from?.id!)) {
    await ctx.reply('You are not authorized to use this bot.')
    return
  }

  await ctx.conversation.enter('add-perfume')
})

bot.use(
  createConversation(updateOrderStatusConversation, 'update-order-status'),
)

bot.command('listorders', async (ctx) => {
  if (!allowedUserIds.includes(ctx.from?.id!)) {
    await ctx.reply('You are not authorized to use this bot.')
    return
  }

  await ctx.conversation.enter('update-order-status')
})

export const setWebhook = async (url: string) => {
  await bot.api.setWebhook(url)
}

if (process.env.NODE_ENV !== 'production') {
  bot.start()
}
