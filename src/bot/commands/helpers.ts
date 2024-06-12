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
