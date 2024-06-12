import type { AromaType } from '@prisma/client'
import { InlineKeyboard } from 'grammy'

import { getAromas } from '@/app/actions/aroma/actions'
import { createPerfume } from '@/app/actions/perfume/actions'
import type { MyContext, MyConversation } from '@/bot'
import {
  downloadFile,
  getAromaKeyboard,
  handlePhotoUpload,
} from '@/bot/commands/helpers'

export const addPerfumeConversation = async (
  conversation: MyConversation,
  ctx: MyContext,
) => {
  await ctx.reply('Please provide the name of the perfume:')
  const {
    msg: { text: perfumeName },
  } = await conversation.waitFor('message:text')

  const fileIds: string[] = []
  await handlePhotoUpload(conversation, ctx, fileIds)

  const imageFiles = await Promise.all(
    fileIds.map(async (fileId: string) => {
      const file = await ctx.api.getFile(fileId)
      const downloadUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`
      return downloadFile(downloadUrl)
    }),
  )

  const allAromas = await getAromas()
  const selectedAromas: {
    name: string
    noteType: AromaType
  }[] = []

  await ctx.reply('Please select aromas for the perfume:', {
    reply_markup: getAromaKeyboard(allAromas, selectedAromas),
  })

  const handleAromaSelection = async () => {
    const { message, callbackQuery } = await conversation.wait()

    if (message?.text === 'done') {
      return
    }

    const aromaSelection = callbackQuery?.data
    const selectedAroma = allAromas.find(
      (aroma) => aroma.name === aromaSelection,
    )

    if (selectedAroma) {
      const existingAromaIndex = selectedAromas.findIndex(
        (a) => a.name === selectedAroma.name,
      )

      if (existingAromaIndex !== -1) {
        // Remove the aroma if it's already selected
        selectedAromas.splice(existingAromaIndex, 1)
        await ctx.reply(
          `Aroma ${selectedAroma.name} removed. You can select more or type 'done' to finish.`,
        )
      } else {
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
        await ctx.reply('Please select aromas for the perfume:', {
          reply_markup: getAromaKeyboard(allAromas, selectedAromas),
        })
      }
    }

    if (selectedAromas.length < allAromas.length) {
      await handleAromaSelection()
    }
  }

  await handleAromaSelection()

  const response = await createPerfume(perfumeName, imageFiles, selectedAromas)
  await ctx.reply(response.message)
}
