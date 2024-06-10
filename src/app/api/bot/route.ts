import { Bot } from 'grammy'
import { v4 } from 'uuid'

import prisma from '@/app/actions'

const addPerfume = async (name: string, aromaNames: string[]) => {
  try {
    const existingPerfume = await prisma.perfume.findUnique({ where: { name } })

    if (existingPerfume) {
      return { success: false, message: 'Perfume already exists' }
    }

    const aromas = await Promise.all(
      aromaNames.map(async (aromaName) => {
        let aroma = await prisma.aroma.findUnique({
          where: { name: aromaName },
        })
        if (!aroma) {
          aroma = await prisma.aroma.create({
            data: { id: v4(), name: aromaName },
          })
        }
        return aroma
      }),
    )

    await prisma.perfume.create({
      data: {
        id: v4(),
        name,
        aromas: {
          create: aromas.map((aroma) => ({
            aromaId: aroma.id,
            noteType: 'MIDDLE', // Default note type
          })),
        },
      },
    })

    return { success: true, message: `Perfume ${name} created successfully` }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'An error occurred while creating the perfume',
    }
  }
}

const addAroma = async (name: string) => {
  try {
    const existingAroma = await prisma.aroma.findUnique({ where: { name } })

    if (existingAroma) {
      return { success: false, message: 'Aroma already exists' }
    }

    await prisma.aroma.create({ data: { id: v4(), name } })

    return { success: true, message: `Aroma ${name} created successfully` }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'An error occurred while creating the aroma',
    }
  }
}

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN as string)

bot.command('start', (ctx) => {
  ctx.reply(
    'Welcome! Use /addPerfume <name> <aromas> to add a new perfume or /addAroma <name> to add a new aroma.',
  )
})

bot.command('addPerfume', async (ctx) => {
  const text = ctx.message?.text.split(' ').slice(1)
  const name = text ? text[0] : ''
  const aromaNames = text?.slice(1).join(' ').split(',') || []

  const response = await addPerfume(name, aromaNames)
  ctx.reply(response.message)
})

bot.command('addAroma', async (ctx) => {
  const name = ctx.message?.text.split(' ').slice(1).join(' ')

  const response = await addAroma(name as string)
  ctx.reply(response.message)
})

bot.start()
