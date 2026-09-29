# Архитектура

## Обзор

```text
Telegram User
    │
    ├─ /start + reply-keyboard ──► api/bot.ts (grammY webhook)
    │                                  │
    │                                  ├─ текст: Услуги / Контакты / Помощь
    │                                  └─ web_app «Открыть портфолио»
    │                                           │
    └─ Mini App (Vue SPA) ◄─────────────────────┘
            │
            │  Telegram.WebApp.sendData(JSON)
            ▼
       api/bot.ts  message:web_app_data
            │
            ├─ ack пользователю
            └─ sendMessage → ADMIN_CHAT_ID
```

## Роли файлов

| Путь | Роль |
|---|---|
| `src/App.vue` | Скролл-лента секций, состояние выбранных услуг |
| `src/composables/useTelegram.ts` | `ready` / `expand`, тема, haptic, `sendData`, мок вне TG |
| `src/data/portfolio.ts` | Единый контент: био, стек, проекты, услуги, контакты |
| `src/types/index.ts` | `Project`, `Service`, `ContactPayload`, … |
| `src/types/telegram.d.ts` | Типы `window.Telegram.WebApp` |
| `src/components/*` | UI: профиль, стек, проекты, калькулятор, форма |
| `api/bot.ts` | Webhook: меню + приём заявок; импортирует `portfolio` |
| `vercel.json` | Build → `dist`, SPA rewrite без перехвата `/api/*` |

## Поток заявки

1. Пользователь жмёт **«Открыть портфолио»** (тип `web_app`) — так Telegram разрешает `sendData`.
2. В Mini App выбирает услуги, заполняет [`ContactForm.vue`](../src/components/ContactForm.vue).
3. Payload (`ContactPayload`) сериализуется и уходит через `WebApp.sendData`.
4. Telegram доставляет `message.web_app_data` на webhook бота.
5. Бот подтверждает пользователю и форвардит текст админу (`ADMIN_CHAT_ID`).

Если `ADMIN_CHAT_ID` пуст, бот всё равно отвечает пользователю и пишет ошибку в логи — функция не падает.

## Общий контент

Прайс и контакты в чате бота собираются из `portfolio` (не захардкожены отдельно), чтобы Mini App и `/Услуги` / `/Контакты` не расходились.
