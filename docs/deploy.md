# Деплой на Vercel

Бот: [@pavel_m_portfolio_bot](https://t.me/pavel_m_portfolio_bot)

## 1. Репозиторий и проект

1. Запушьте репозиторий и импортируйте его в [Vercel](https://vercel.com).
2. Build Command: `npm run build`, Output Directory: `dist` (уже в `vercel.json`).
3. Framework Preset можно оставить Other / Vite — важно, чтобы подхватился `api/bot.ts`.

## 2. Environment Variables

В Project Settings → Environment Variables (Production + Preview при необходимости):

| Key | Пример |
|---|---|
| `BOT_TOKEN` | токен от BotFather |
| `ADMIN_CHAT_ID` | ваш числовой chat id |
| `WEBAPP_URL` | `https://your-app.vercel.app` |

После первого деплоя скопируйте URL, пропишите `WEBAPP_URL` и сделайте **Redeploy**.

## 3. Webhook бота

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://your-app.vercel.app/api/bot"
```

Проверка:

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

Ожидается `url` на `/api/bot` и без ошибок в `last_error_message`.

Health-check функции (GET):

```bash
curl "https://your-app.vercel.app/api/bot"
# {"ok":true,"service":"twa-portfolio-bot"}
```

## 4. BotFather

Бот уже создан: `@pavel_m_portfolio_bot`.

1. `/setmenubutton` для этого бота → URL = `WEBAPP_URL` (удобный вход в приложение).
2. Основной сценарий заявок — кнопка **«Открыть портфолио»** в reply-keyboard после `/start` (тип `web_app`).

### Caveat: `sendData`

`Telegram.WebApp.sendData` работает **только** если Mini App открыт с keyboard-кнопки `web_app`.  
Открытие из Menu Button или по прямой ссылке — `sendData` недоступен; UI покажет подсказку открыть приложение из меню бота.

## 5. Чеклист первого запуска

- [ ] `BOT_TOKEN`, `ADMIN_CHAT_ID`, `WEBAPP_URL` заданы на Vercel
- [ ] Redeploy после заполнения `WEBAPP_URL`
- [ ] `setWebhook` на `https://…/api/bot`
- [ ] `getWebhookInfo` без ошибок
- [ ] `/start` в боте показывает клавиатуру
- [ ] «Открыть портфолио» открывает Mini App
- [ ] Тестовая заявка приходит вам в `ADMIN_CHAT_ID`
- [ ] (Опционально) Menu Button указывает на тот же URL

## Rewrites

В `vercel.json` SPA fallback исключает `/api/*`, чтобы webhook не уходил в `index.html`. Serverless-функции из папки `api/` имеют приоритет над статикой.
