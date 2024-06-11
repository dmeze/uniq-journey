import type { Context } from 'grammy'
import { Bot, InlineKeyboard, session } from 'grammy'
import type { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { conversations, createConversation } from '@grammyjs/conversations'
import type { AromaType } from '@prisma/client'
import type { PhotoSize } from '@grammyjs/types'

import { createAroma, getAromas } from '@/app/actions/aroma/actions'
import { createPerfume } from '@/app/actions/perfume/actions'

const allowedUserIds = JSON.parse(process.env.TELEGRAM_ALLOWED_IDS || '[]')

type MyContext = Context & ConversationFlavor
type MyConversation = Conversation<MyContext>

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

const addPerfumeConversation = async (
  conversation: MyConversation,
  ctx: MyContext,
) => {
  await ctx.reply('Please provide the name of the perfume:')
  const {
    msg: { text: perfumeName },
  } = await conversation.waitFor('message:text')

  await ctx.reply(
    'Please upload images for the perfume (send multiple images):',
  )
  const {
    message: { photo },
  } = await conversation.waitFor('message:photo')

  const fileIds = photo?.map(({ file_id }: PhotoSize) => file_id)

  const imageFiles = await Promise.all(
    fileIds.map((fileId: string) => bot.api.getFile(fileId)),
  )

  const allAromas = await getAromas()
  const aromaKeyboard = new InlineKeyboard()
  allAromas.forEach((aroma) => {
    aromaKeyboard.text(aroma.name, aroma.name).row()
  })

  await ctx.reply('Please select aromas for the perfume:', {
    reply_markup: aromaKeyboard,
  })

  const selectedAromas: {
    name: string
    noteType: AromaType
  }[] = []

  const handleAromaSelection = async () => {
    const { message, callbackQuery } = await conversation.wait()

    if (message?.text === 'done') {
      return
    }

    const aromaSelection = callbackQuery?.data
    const selectedAroma = allAromas.find(
      (aroma) => aroma.name === aromaSelection,
    )

    if (
      selectedAroma &&
      !selectedAromas.find((a) => a.name === selectedAroma.name)
    ) {
      const noteTypeKeyboard = new InlineKeyboard()
      noteTypeKeyboard.text('HIGH', 'HIGH').row()
      noteTypeKeyboard.text('MIDDLE', 'MIDDLE').row()
      noteTypeKeyboard.text('BASE', 'BASE').row()

      await ctx.reply(`Select note type for aroma ${selectedAroma.name}:`, {
        reply_markup: noteTypeKeyboard,
      })

      const { callbackQuery: noteCallback } = await conversation.wait()
      const noteType = noteCallback?.data as AromaType

      selectedAromas.push({ name: selectedAroma.name, noteType })
      await ctx.reply(
        `Aroma ${selectedAroma.name} with note type ${noteType} added. You can select more or type 'done' to finish.`,
      )
    }

    if (selectedAromas.length < allAromas.length) {
      await handleAromaSelection()
    }
  }

  await handleAromaSelection()

  const response = await createPerfume(perfumeName, imageFiles, selectedAromas)
  await ctx.reply(response.message)
}

bot.use(createConversation(addPerfumeConversation))

bot.command('addperfume', async (ctx) => {
  if (!allowedUserIds.includes(ctx.from?.id!)) {
    await ctx.reply('You are not authorized to use this bot.')
    return
  }

  await ctx.conversation.enter('addPerfumeConversation')
})

export const setWebhook = async (url: string) => {
  await bot.api.setWebhook(url)
}

setWebhook(`${process.env.VERCEL_URL}/api/bot`).catch(console.error)

if (process.env.NODE_ENV !== 'production') {
  bot.start()
}
