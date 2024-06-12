import axios from 'axios'
import { InlineKeyboard } from 'grammy'
import type { AromaType } from '@prisma/client'
import { put } from '@vercel/blob'

import type { MyContext, MyConversation } from '@/bot'
import { type Aroma, getAromas } from '@/app/actions/aroma/actions'
import { updatePerfume } from '@/app/actions/perfume/actions'

export const downloadFile = async (url: string): Promise<ArrayBuffer> => {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  return response.data
}

export const handlePhotoUpload = async (
  conversation: MyConversation,
  ctx: MyContext,
  fileIds: string[],
) => {
  await ctx.reply('Please upload images for the perfume:')
  const { message } = await conversation.waitFor('message:photo')

  const largestPhoto = message.photo.reduce((prev, current) => {
    return (prev.file_size || 0) > (current.file_size || 0) ? prev : current
  })

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

  const { callbackQuery } = await conversation.wait()

  const aromaSelection = callbackQuery?.data

  const selectedAroma = allAromas.find((aroma) => aroma.name === aromaSelection)
  if (selectedAroma) {
    const existingAromaIndex = selectedAromas.findIndex(
      (a) => a.name === selectedAroma.name,
    )

    if (existingAromaIndex !== -1) {
      selectedAromas.splice(existingAromaIndex, 1)
      await ctx.reply(`Aroma ${selectedAroma.name} removed.`)
    } else {
      const noteTypeKeyboard = new InlineKeyboard()
        .text('HIGH', 'HIGH')
        .row()
        .text('MIDDLE', 'MIDDLE')
        .row()
        .text('BASE', 'BASE')
        .row()

      await ctx.reply(`Select note type for aroma ${selectedAroma.name}:`, {
        reply_markup: noteTypeKeyboard,
      })

      const { callbackQuery: noteCallback } = await conversation.wait()
      const noteType = noteCallback?.data as AromaType

      selectedAromas.push({ name: selectedAroma.name, noteType })
      await ctx.reply(
        `Aroma ${selectedAroma.name} with note type ${noteType} added. You can select more or proceed.`,
      )
    }
  }

  const continueKeyboard = new InlineKeyboard()
    .text('Add more aromas', 'add_more_aromas')
    .text('Proceed', 'proceed')

  await ctx.reply('Would you like to add more aromas or proceed?', {
    reply_markup: continueKeyboard,
  })

  const { callbackQuery: aromasContinueCallback } = await conversation.wait()
  if (aromasContinueCallback?.data === 'add_more_aromas') {
    await handleAromaSelection(conversation, allAromas, selectedAromas, ctx)
  }
}

export const editPerfumeDetails = async (
  conversation: MyConversation,
  ctx: MyContext,
  perfumeId: string,
  perfumeProp: any,
) => {
  const perfume = { ...perfumeProp }

  const editKeyboard = new InlineKeyboard()
    .text('Edit Name', 'edit_name')
    .text('Add Photos', 'add_photos')
    .text('Remove Photos', 'remove_photos')
    .text('Edit Aromas', 'edit_aromas')
    .text('Finish', 'finish')

  await ctx.reply('What would you like to edit?', {
    reply_markup: editKeyboard,
  })

  const { callbackQuery: editCallback } = await conversation.wait()

  if (editCallback?.data === 'edit_name') {
    await ctx.reply('Please provide the new name:')
    const {
      msg: { text: newName },
    } = await conversation.waitFor('message:text')

    perfume.name = newName
  }

  if (editCallback?.data === 'add_photos') {
    const fileIds: string[] = []
    await handlePhotoUpload(conversation, ctx, fileIds)

    const newImageFiles = await Promise.all(
      fileIds.map(async (fileId: string) => {
        const file = await ctx.api.getFile(fileId)
        const downloadUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`

        return put(
          `images/userPerfumes/${perfume.name}/${perfume.name}`,
          await downloadFile(downloadUrl),
          {
            access: 'public',
          },
        ).then(({ url }) => url)
      }),
    )

    perfume.imageURLs.push(...newImageFiles)
  }

  if (editCallback?.data === 'remove_photos') {
    await ctx.reply(`Current photos: ${perfume.imageURLs.join(', ')}
      Please provide the index of the photo to remove (starting from 0):`)

    const {
      msg: { text: index },
    } = await conversation.waitFor('message:text')

    const photoIndex = parseInt(index, 10)
    if (photoIndex >= 0 && photoIndex < perfume.imageURLs.length) {
      perfume.imageURLs.splice(photoIndex, 1)
    }
  }

  if (editCallback?.data === 'edit_aromas') {
    const allAromas = await getAromas()
    const selectedAromas = perfume.aromas.map((aroma: Aroma) => ({
      id: aroma.aroma.id,
      name: aroma.aroma.name,
      noteType: aroma.noteType,
      perfumeId: aroma.perfumeId,
    }))

    await handleAromaSelection(conversation, allAromas, selectedAromas, ctx)

    perfume.aromas = selectedAromas.map((aroma: Aroma) => ({
      aroma: { id: aroma.id, name: aroma.name },
      noteType: aroma.noteType,
      perfumeId: aroma.perfumeId,
      aromaId: aroma.id,
    }))
  }

  if (editCallback?.data !== 'finish') {
    await editPerfumeDetails(conversation, ctx, perfumeId, perfume)
  } else {
    const response = await conversation.external(async () =>
      updatePerfume(perfumeId, perfume.name, perfume.imageURLs, perfume.aromas),
    )
    await ctx.reply(response.message)
  }
}
