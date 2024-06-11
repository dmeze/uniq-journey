import type { Context, SessionFlavor } from 'grammy'
import { Bot, InlineKeyboard } from 'grammy'
import type { ConversationFlavor } from '@grammyjs/conversations'
import { conversations, createConversation } from '@grammyjs/conversations'
import type { AromaType } from '@prisma/client'

import { createAroma, getAromas } from '@/app/actions/aroma/actions'
import { createPerfume } from '@/app/actions/perfume/actions'

const allowedUserIds = JSON.parse(process.env.TELEGRAM_ALLOWED_IDS || '[]')

export const bot = new Bot<Context & ConversationFlavor & SessionFlavor<any>>(
  process.env.TELEGRAM_BOT_TOKEN as string,
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
  conversation: any,
  ctx: Context & ConversationFlavor & SessionFlavor<any>,
) => {
  await ctx.reply('Please provide the name of the perfume:')
  const nameMessage = await conversation.waitFor('message:text')
  const perfumeName = nameMessage.text

  await ctx.reply(
    'Please upload images for the perfume (send multiple images):',
  )
  const imageMessages = await conversation.waitFor('message:photo', 5)

  const fileIds = imageMessages.map(
    (imageMessage: { photo: { (): any; new (): any; file_id: any }[] }) =>
      imageMessage.photo.pop()?.file_id,
  )

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

  const aromaSelections = new Set<string>()

  while (selectedAromas.length < allAromas.length) {
    const aromaSelection = await conversation.waitFor('callback_query:data')
    if (aromaSelections.has(aromaSelection.data)) {
      continue
    }
    aromaSelections.add(aromaSelection.data)

    const selectedAroma = allAromas.find(
      (aroma) => aroma.name === aromaSelection.data,
    )
    if (selectedAroma) {
      const noteTypeKeyboard = new InlineKeyboard()
      noteTypeKeyboard.text('HIGH', 'HIGH').row()
      noteTypeKeyboard.text('MIDDLE', 'MIDDLE').row()
      noteTypeKeyboard.text('BASE', 'BASE').row()

      await ctx.reply(`Select note type for aroma ${selectedAroma.name}:`, {
        reply_markup: noteTypeKeyboard,
      })

      const noteTypeSelection = await conversation.waitFor(
        'callback_query:data',
      )
      const noteType = noteTypeSelection.data as AromaType

      selectedAromas.push({ name: selectedAroma.name, noteType })
      await ctx.reply(
        `Aroma ${selectedAroma.name} with note type ${noteType} added. You can select more or type 'done' to finish.`,
      )
    }
  }

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
