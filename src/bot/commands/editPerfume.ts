import type { MyContext, MyConversation } from '@/bot'
import { getPerfumeById, getPerfumes } from '@/app/actions/perfume/actions'
import { editPerfumeDetails } from '@/bot/commands/helpers'

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

  await editPerfumeDetails(conversation, ctx, perfumeId, perfume)
}
