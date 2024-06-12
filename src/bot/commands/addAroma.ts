import { createAroma } from '@/app/actions/aroma/actions'
import type { MyContext } from '@/bot'

export const addAroma = async (ctx: MyContext, allowedUserIds: number[]) => {
  if (!allowedUserIds.includes(ctx.from?.id!)) {
    await ctx.reply('You are not authorized to use this bot.')
    return
  }

  const name = ctx.message?.text?.split(' ').slice(1).join(' ')

  if (!name) {
    await ctx.reply(
      'Please provide a name for the aroma. Usage: /addaroma <name>',
    )
    return
  }

  const response = await createAroma(name as string)
  await ctx.reply(response.message)
}
