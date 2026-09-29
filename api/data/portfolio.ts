/** Colocated under api/ so Vercel bundles it with the serverless function. */

export type ProjectCategory = 'TWA' | 'Web' | 'Backend'

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  shortDescription: string
  description: string
  stack: string[]
  githubUrl: string
  demoUrl: string
}

export interface Service {
  id: string
  title: string
  description: string
  priceFrom: number
  unit: string
}

export interface PortfolioContacts {
  telegram: string
  email: string
  github: string
}

export interface PortfolioData {
  name: string
  role: string
  bio: string
  availability: string
  stack: string[]
  contacts: PortfolioContacts
  projects: Project[]
  services: Service[]
}

export const portfolio: PortfolioData = {
  name: 'Pavel',
  role: 'Fullstack / Telegram Mini Apps',
  bio: 'Делаю Telegram Mini Apps и fullstack-продукты на Vue 3 + TypeScript + Node.js. От идеи и UX до деплоя на Vercel: боты на grammY, TWA, API и аккуратный UI под тему Telegram.',
  availability: 'Доступен к проектам',
  stack: [
    'Vue 3',
    'TypeScript',
    'Node.js',
    'grammY',
    'Vite',
    'Tailwind CSS',
    'Vercel',
    'PostgreSQL',
    'REST / Webhooks',
    'Telegram Bot API',
  ],
  contacts: {
    telegram: '@pavel_m_portfolio_bot',
    email: 'pavel@example.com',
    github: 'https://github.com/pavel',
  },
  projects: [
    {
      id: 'twa-portfolio',
      title: 'TWA Portfolio',
      category: 'TWA',
      shortDescription: 'Мини-приложение портфолио с заявками через sendData.',
      description:
        'Telegram Mini App на Vue 3: профиль, проекты, калькулятор услуг и форма заявки. Данные уходят в бота через WebApp.sendData и пересылаются админу.',
      stack: ['Vue 3', 'TypeScript', 'Tailwind', 'grammY', 'Vercel'],
      githubUrl: 'https://github.com/pavel/twa-portfolio',
      demoUrl: '#',
    },
    {
      id: 'shop-miniapp',
      title: 'Shop Mini App',
      category: 'TWA',
      shortDescription: 'Каталог и корзина внутри Telegram с оплатой.',
      description:
        'Каталог товаров, корзина и оформление заказа в Mini App. Backend принимает webhook от бота, хранит заказы и шлёт статусы пользователю.',
      stack: ['Vue 3', 'Pinia', 'Node.js', 'PostgreSQL', 'Telegram Payments'],
      githubUrl: 'https://github.com/pavel/shop-miniapp',
      demoUrl: '#',
    },
    {
      id: 'saas-landing',
      title: 'SaaS Landing + Dashboard',
      category: 'Web',
      shortDescription: 'Лендинг и личный кабинет для B2B SaaS.',
      description:
        'Маркетинговый лендинг и auth-дашборд: метрики, биллинг-статус, онбординг. Адаптивная вёрстка, SEO и быстрый Vite-бандл.',
      stack: ['Vue 3', 'Vite', 'Tailwind', 'TypeScript'],
      githubUrl: 'https://github.com/pavel/saas-landing',
      demoUrl: '#',
    },
    {
      id: 'support-bot',
      title: 'Support Desk Bot',
      category: 'Backend',
      shortDescription: 'Бот поддержки с очередью тикетов и админ-панелью.',
      description:
        'grammY-бот с FSM-диалогами, очередью обращений и уведомлениями операторам. Webhook на serverless, логирование и ретраи.',
      stack: ['Node.js', 'grammY', 'Redis', 'Vercel'],
      githubUrl: 'https://github.com/pavel/support-desk-bot',
      demoUrl: '#',
    },
    {
      id: 'analytics-api',
      title: 'Events Analytics API',
      category: 'Backend',
      shortDescription: 'API сбора событий из Mini Apps и ботов.',
      description:
        'REST API для событий из TWA и ботов: ingest, агрегации по дню, экспорт CSV. TypeScript, валидация схем, деплой на Vercel Functions.',
      stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Vercel'],
      githubUrl: 'https://github.com/pavel/events-analytics-api',
      demoUrl: '#',
    },
    {
      id: 'booking-web',
      title: 'Booking Web App',
      category: 'Web',
      shortDescription: 'Онлайн-запись с календарём и Telegram-уведомлениями.',
      description:
        'Веб-приложение записи: слоты, подтверждение, напоминания в Telegram. Клиент на Vue, API и cron-уведомления на Node.js.',
      stack: ['Vue 3', 'Node.js', 'grammY', 'Tailwind'],
      githubUrl: 'https://github.com/pavel/booking-web',
      demoUrl: '#',
    },
  ],
  services: [
    {
      id: 'landing',
      title: 'Лендинг',
      description: 'Одностраничный сайт под продукт или услугу, адаптив и деплой.',
      priceFrom: 40000,
      unit: 'от',
    },
    {
      id: 'twa',
      title: 'Telegram Mini App',
      description: 'TWA на Vue: UI под тему Telegram, формы, интеграция с ботом.',
      priceFrom: 80000,
      unit: 'от',
    },
    {
      id: 'bot',
      title: 'Telegram-бот',
      description: 'Бот на grammY: меню, webhook, заявки, уведомления админу.',
      priceFrom: 50000,
      unit: 'от',
    },
    {
      id: 'rework',
      title: 'Доработка',
      description: 'Фичи, багфиксы и рефакторинг существующего TWA / бота / сайта.',
      priceFrom: 15000,
      unit: 'от / задача',
    },
  ],
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}
