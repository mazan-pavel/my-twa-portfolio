# TWA Portfolio Monorepo

Vue 3 Mini App и serverless-бот на grammY для деплоя на Vercel. Портфолио Pavel: проекты, стек, калькулятор услуг и заявки через `Telegram.WebApp.sendData`.

Бот в Telegram: [@pavel_m_portfolio_bot](https://t.me/pavel_m_portfolio_bot)

## Стек

- Frontend: Vue 3, TypeScript, Tailwind CSS, Lucide, Telegram Web App SDK
- Backend: grammY webhook в `api/bot.ts`
- Deploy: Vercel (`dist/` + serverless function)

## Быстрый старт

```bash
npm install
cp .env.example .env
npm run dev
```

Подробнее: [локальная разработка](docs/local-dev.md).

## Документация

| Документ | О чём |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Схема TWA ↔ бот ↔ админ, поток заявки |
| [docs/deploy.md](docs/deploy.md) | Vercel, webhook, BotFather, чеклист запуска |
| [docs/local-dev.md](docs/local-dev.md) | Dev без Telegram, мок-юзер, тест бота |

## Переменные окружения

| Переменная | Описание |
|---|---|
| `BOT_TOKEN` | Токен бота от [@BotFather](https://t.me/BotFather) |
| `ADMIN_CHAT_ID` | Chat ID для пересылки заявок |
| `WEBAPP_URL` | Публичный URL Mini App после деплоя |

Шаблон: [`.env.example`](.env.example). На Vercel — Project Settings → Environment Variables.

## Скрипты

```bash
npm run dev        # Vite dev server
npm run build      # vue-tsc + vite build
npm run preview    # превью production-сборки
npm run typecheck  # только проверка типов
```

## Структура

```
api/bot.ts                 # grammY webhook
docs/                      # architecture, deploy, local-dev
public/favicon.svg
src/
  App.vue
  main.ts
  assets/main.css
  components/              # Header, Stack, Projects, Services, ContactForm…
  composables/useTelegram.ts
  data/portfolio.ts        # контент Pavel
  types/                   # index.ts + telegram.d.ts
index.html
vercel.json
```

## Важно

`sendData` работает только если Mini App открыт с keyboard-кнопки **«Открыть портфолио»** (`web_app`). Menu Button / прямая ссылка — заявка не уйдёт (см. [deploy.md](docs/deploy.md)).
