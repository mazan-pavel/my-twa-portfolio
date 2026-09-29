import { computed, ref } from 'vue'
import type { TelegramWebApp, TelegramWebAppUser } from '@/types/telegram'

const MOCK_USER: TelegramWebAppUser = {
  id: 0,
  first_name: 'Pavel',
  last_name: 'Dev',
  username: 'pavel_dev',
  language_code: 'ru',
}

const ready = ref(false)
const webApp = ref<TelegramWebApp | null>(null)

function getWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null
}

export function useTelegram() {
  const tg = computed(() => webApp.value)
  const user = computed<TelegramWebAppUser>(() => {
    return webApp.value?.initDataUnsafe?.user ?? MOCK_USER
  })
  const colorScheme = computed(() => webApp.value?.colorScheme ?? 'light')
  const isTelegram = computed(() => Boolean(webApp.value?.initData))
  const themeParams = computed(() => webApp.value?.themeParams ?? {})

  function init() {
    const app = getWebApp()
    webApp.value = app
    if (!app) {
      ready.value = true
      return
    }
    app.ready()
    app.expand()
    ready.value = true
  }

  function haptic(
    style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light',
  ) {
    try {
      webApp.value?.HapticFeedback?.impactOccurred(style)
    } catch {
      // ignore outside Telegram
    }
  }

  function notifyHaptic(type: 'error' | 'success' | 'warning' = 'success') {
    try {
      webApp.value?.HapticFeedback?.notificationOccurred(type)
    } catch {
      // ignore
    }
  }

  function showAlert(message: string) {
    if (webApp.value?.showAlert) {
      webApp.value.showAlert(message)
      return
    }
    window.alert(message)
  }

  function sendData(payload: unknown) {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload)
    if (!webApp.value?.sendData) {
      console.info('[sendData mock]', data)
      showAlert(
        'Заявка сформирована. Откройте Mini App кнопкой «Открыть портфолио» в боте, чтобы отправить данные.',
      )
      return false
    }
    try {
      webApp.value.sendData(data)
      notifyHaptic('success')
      return true
    } catch (error) {
      console.error('sendData failed', error)
      notifyHaptic('error')
      showAlert('Не удалось отправить заявку. Откройте приложение из кнопки бота.')
      return false
    }
  }

  return {
    ready,
    tg,
    user,
    colorScheme,
    isTelegram,
    themeParams,
    init,
    haptic,
    notifyHaptic,
    showAlert,
    sendData,
  }
}
