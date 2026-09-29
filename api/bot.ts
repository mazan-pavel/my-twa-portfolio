import { Bot, InlineKeyboard, Keyboard, webhookCallback } from 'grammy'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { portfolio, formatPrice } from '../src/data/portfolio'
import type { ContactPayload } from '../src/types'

const BOT_TOKEN = process.env.BOT_TOKEN ?? ''
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID ?? ''
const WEBAPP_URL = process.env.WEBAPP_URL ?? 'https://example.com'

function buildServicesText(): string {
  const lines = portfolio.services.map(
    (s) => `• ${s.title} — ${s.unit} ${formatPrice(s.priceFrom)}`,
  )
  return [
    'Услуги (ориентир «от»):',
    '',
    ...lines,
    '',
    'Откройте портфолио, чтобы посчитать сумму и оставить заявку.',
  ].join('\n')
}

function buildContactsText(): string {
  const { telegram, email, github } = portfolio.contacts
  return [
    'Контакты:',
    '',
    `• Бот: ${telegram} (https://t.me/${telegram.replace(/^@/, '')})`,
    `• Email: ${email}`,
    `• GitHub: ${github}`,
    '',
    'Удобнее оставить заявку формой в Mini App — кнопка «Открыть портфолио».',
  ].join('\n')
}

const HELP_TEXT = [
  'Помощь:',
  '',
  '/start — главное меню',
  '/help — эта справка',
  '',
  'Кнопки:',
  '• Открыть портфолио — Mini App',
  '• Услуги — краткий прайс',
  '• Контакты — как связаться',
  '• Помощь — список команд',
].join('\n')

function buildMainKeyboard() {
  return new Keyboard()
    .webApp('Открыть портфолио', WEBAPP_URL)
    .row()
    .text('Услуги')
    .text('Контакты')
    .row()
    .text('Помощь')
    .resized()
    .persistent()
}

function createBot() {
  if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN is not set')
  }

  const bot = new Bot(BOT_TOKEN)

  bot.command('start', async (ctx) => {
    const name = ctx.from?.first_name ?? 'друг'
    await ctx.reply(
      [
        `Привет, ${name}!`,
        '',
        `Я ${portfolio.name} — ${portfolio.role}.`,
        'Откройте портфолио, посмотрите проекты и услуги или сразу оставьте заявку.',
      ].join('\n'),
      { reply_markup: buildMainKeyboard() },
    )
  })

  bot.command('help', async (ctx) => {
    await ctx.reply(HELP_TEXT, { reply_markup: buildMainKeyboard() })
  })

  bot.hears('Услуги', async (ctx) => {
    await ctx.reply(buildServicesText(), {
      reply_markup: new InlineKeyboard().webApp('Открыть калькулятор', WEBAPP_URL),
    })
  })

  bot.hears('Контакты', async (ctx) => {
    await ctx.reply(buildContactsText(), {
      reply_markup: new InlineKeyboard().webApp('Форма в Mini App', WEBAPP_URL),
    })
  })

  bot.hears('Помощь', async (ctx) => {
    await ctx.reply(HELP_TEXT)
  })

  bot.on('message:web_app_data', async (ctx) => {
    const raw = ctx.message.web_app_data?.data ?? ''
    let payload: ContactPayload | null = null

    try {
      payload = JSON.parse(raw) as ContactPayload
    } catch (error) {
      console.error('Failed to parse web_app_data', error, raw)
      await ctx.reply('Не удалось прочитать заявку. Попробуйте ещё раз из Mini App.')
      return
    }

    const services =
      Array.isArray(payload.services) && payload.services.length
        ? payload.services.join(', ')
        : 'не указаны'

    await ctx.reply(
      ['Спасибо! Заявка получена.', 'Я свяжусь с вами в ближайшее время.'].join(
        '\n',
      ),
    )

    if (!ADMIN_CHAT_ID) {
      console.error('ADMIN_CHAT_ID is empty — lead not forwarded')
      return
    }

    const adminText = [
      'Новая заявка из Mini App',
      '',
      `Имя: ${payload.name ?? '—'}`,
      `Контакт: ${payload.contact ?? '—'}`,
      `Услуги: ${services}`,
      `Сообщение: ${payload.message ?? '—'}`,
      '',
      `TG user id: ${payload.from?.id ?? ctx.from?.id ?? '—'}`,
      `TG username: ${payload.from?.username ?? ctx.from?.username ?? '—'}`,
      `Время: ${payload.createdAt ?? new Date().toISOString()}`,
    ].join('\n')

    try {
      await ctx.api.sendMessage(ADMIN_CHAT_ID, adminText)
    } catch (error) {
      console.error('Failed to forward lead to admin', error)
    }
  })

  bot.catch((err) => {
    console.error('Bot error', err)
  })

  return bot
}

let botInstance: Bot | null = null

function getBot() {
  if (!botInstance) {
    botInstance = createBot()
  }
  return botInstance
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, service: 'twa-portfolio-bot' })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' })
    return
  }

  if (!BOT_TOKEN) {
    console.error('BOT_TOKEN is not configured')
    res.status(500).json({ ok: false, error: 'BOT_TOKEN missing' })
    return
  }

  try {
    const handleUpdate = webhookCallback(getBot(), 'https') as (
      req: VercelRequest,
      res: VercelResponse,
    ) => Promise<void>
    await handleUpdate(req, res)
  } catch (error) {
    console.error('Webhook handler error', error)
    if (!res.headersSent) {
      res.status(200).json({ ok: true })
    }
  }
}
