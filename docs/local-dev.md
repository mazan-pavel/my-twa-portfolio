# Локальная разработка

## Frontend

```bash
npm install
cp .env.example .env   # для бота на Vercel; Vite frontend env не обязателен
npm run dev
```

Откройте `http://localhost:5173/`.

### Без Telegram

- Скрипт `telegram-web-app.js` может не инициализировать WebApp полностью.
- [`useTelegram.ts`](../src/composables/useTelegram.ts) подставляет мок-пользователя (Pavel Dev).
- `sendData` пишет payload в консоль и показывает alert с подсказкой открыть Mini App из бота.

Тема и haptic вне Telegram деградируют безопасно (fallback CSS-переменные в `main.css`).

## Контент

Правьте [`src/data/portfolio.ts`](../src/data/portfolio.ts) — оттуда же бот берёт прайс и контакты. Типы — в [`src/types/index.ts`](../src/types/index.ts).

## Бот локально

Webhook Telegram требует **публичный HTTPS**. Варианты:

1. **Предпочтительно:** задеплоить на Vercel Preview/Production и выставить webhook на этот URL (см. [deploy.md](deploy.md)).
2. **Туннель:** `ngrok` / `cloudflared` на локальный порт serverless-функции — сложнее с Vite+api; для v1 проще тестировать бота на Vercel.

Проверка только health-check функции на проде:

```bash
curl https://your-app.vercel.app/api/bot
```

## Сборка

```bash
npm run typecheck
npm run build
npm run preview   # статика dist/; api на preview Vite недоступен
```

Node.js **>= 18** (`engines` в `package.json`).
