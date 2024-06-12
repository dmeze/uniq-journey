import type { AromaType } from '@prisma/client'

import { getAromas } from '@/app/actions/aroma/actions'
import { createPerfume } from '@/app/actions/perfume/actions'
import type { MyContext, MyConversation } from '@/bot'
import {
  downloadFile,
  handleAromaSelection,
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

  const allAromas = await getAromas()
  const selectedAromas: {
    name: string
    noteType: AromaType
  }[] = []

  await handleAromaSelection(conversation, allAromas, selectedAromas, ctx)

  const imageFiles = await conversation.external(async () =>
    Promise.all(
      fileIds.map(async (fileId: string) => {
        const file = await conversation.external(
          async () => await ctx.api.getFile(fileId),
        )
        const downloadUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`
        return downloadFile(downloadUrl, conversation)
      }),
    ),
  )

  const response = await conversation.external(async () =>
    createPerfume(perfumeName, imageFiles, selectedAromas),
  )
  await ctx.reply(response.message)
}
