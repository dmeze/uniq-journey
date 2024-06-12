import { InlineKeyboard } from 'grammy'
import { put } from '@vercel/blob'
import type { AromaType } from '@prisma/client'

import type { MyContext, MyConversation } from '@/bot'
import {
  downloadFile,
  handleAromaSelection,
  handlePhotoUpload,
} from '@/bot/commands/helpers'
import { getAromas } from '@/app/actions/aroma/actions'
import {
  getPerfumeById,
  getPerfumes,
  updatePerfume,
} from '@/app/actions/perfume/actions'

export const editPerfumeConversation = async (
  conversation: MyConversation,
  ctx: MyContext,
) => {
  await ctx.reply('Fetching list of perfumes...')

  const perfumes = await getPerfumes()

  if (perfumes.length === 0) {
    await ctx.reply('No perfumes found.')
    return
  }

  const perfumeList = perfumes.map((perfume, index) => ({
    text: `Perfume ${index + 1}: ${perfume.name}`,
    callback_data: `select_perfume_${perfume.id}`,
  }))

  const keyboard = {
    inline_keyboard: perfumeList.map((perfume) => [
      { text: perfume.text, callback_data: perfume.callback_data },
    ]),
  }

  await ctx.reply('Select a perfume to edit:', {
    reply_markup: keyboard,
  })

  const { callbackQuery } = await conversation.wait()
  const data = callbackQuery?.data

  if (!data?.startsWith('select_perfume_')) {
    await ctx.reply('Invalid selection. Please try again.')
    return
  }

  const perfumeId = data.replace('select_perfume_', '')
  const perfume = await getPerfumeById(perfumeId)

  if (!perfume) {
    await ctx.reply('Perfume not found.')
    return
  }

  await ctx.reply(`Current perfume details:
       Name: ${perfume.name}
       Photos: ${perfume.imageURLs.join(', ')}
  `)

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
    const selectedAromas = perfume.aromas.map((aroma) => ({
      id: aroma.aroma.id,
      name: aroma.aroma.name,
      noteType: aroma.noteType,
      perfumeId: aroma.perfumeId,
    }))

    await handleAromaSelection(conversation, allAromas, selectedAromas, ctx)

    perfume.aromas = selectedAromas.map((aroma) => ({
      name: aroma.name,
      noteType: aroma.noteType,
    })) as unknown as {
      aroma: { id: string; name: string }
      noteType: AromaType
      perfumeId: string
      aromaId: string
    }[]
  }

  const response = await conversation.external(async () =>
    updatePerfume(
      perfumeId,
      perfume.name,
      perfume.imageURLs,
      perfume.aromas as unknown as { name: string; noteType: AromaType }[],
    ),
  )
  await ctx.reply(response.message)
}
