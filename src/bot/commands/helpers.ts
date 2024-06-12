import axios from 'axios'
import { InlineKeyboard } from 'grammy'
import type { AromaType } from '@prisma/client'

import type { MyContext, MyConversation } from '@/bot'

export const downloadFile = async (url: string) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  return Buffer.from(response.data, 'binary')
}

export const handlePhotoUpload = async (
  conversation: MyConversation,
  ctx: MyContext,
  fileIds: string[],
) => {
  await ctx.reply('Please upload images for the perfume:')
  const { message } = await conversation.waitFor('message:photo')
  const largestPhoto = message.photo.pop()

  if (largestPhoto) {
    fileIds.push(largestPhoto.file_id)
  }

  const continueKeyboard = new InlineKeyboard()
    .text('Add more photos', 'add_more_photos')
    .text('Proceed', 'proceed')

  await ctx.reply('Would you like to add more photos or proceed?', {
    reply_markup: continueKeyboard,
  })

  const { callbackQuery } = await conversation.wait()
  if (callbackQuery?.data === 'add_more_photos') {
    await handlePhotoUpload(conversation, ctx, fileIds)
  }
}

export const getAromaKeyboard = (
  allAromas: { id: string; name: string }[],
  selectedAromas: { name: string; noteType: AromaType }[],
) => {
  const aromaKeyboard = new InlineKeyboard()
  allAromas.forEach((aroma) => {
    const isSelected = selectedAromas.some((a) => a.name === aroma.name)
    const buttonText = isSelected ? `${aroma.name} ✅` : aroma.name
    aromaKeyboard.text(buttonText, aroma.name).row()
  })
  return aromaKeyboard
}

export const handleAromaSelection = async (
  conversation: MyConversation,
  allAromas: { id: string; name: string }[],
  selectedAromas: { name: string; noteType: AromaType }[],
  ctx: MyContext,
) => {
  await ctx.reply('Please select aromas for the perfume:', {
    reply_markup: getAromaKeyboard(allAromas, selectedAromas),
  })

  const { message, callbackQuery } = await conversation.wait()

  if (message?.text === 'done') {
    return
  }

  const aromaSelection = callbackQuery?.data
  const selectedAroma = allAromas.find((aroma) => aroma.name === aromaSelection)

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
    await handleAromaSelection(conversation, allAromas, selectedAromas, ctx)
  }
}
