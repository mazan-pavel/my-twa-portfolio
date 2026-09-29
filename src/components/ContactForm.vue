<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Send } from 'lucide-vue-next'
import { portfolio } from '@/data/portfolio'
import type { ContactPayload } from '@/types'
import { useTelegram } from '@/composables/useTelegram'

const props = defineProps<{
  selectedServiceIds: string[]
}>()

const { user, sendData, haptic, showAlert } = useTelegram()

const name = ref(user.value.first_name ?? '')
const contact = ref(user.value.username ? `@${user.value.username}` : '')
const message = ref('')
const serviceIds = ref<string[]>([...props.selectedServiceIds])
const submitting = ref(false)
const sent = ref(false)

watch(
  () => props.selectedServiceIds,
  (ids) => {
    serviceIds.value = [...ids]
  },
)

const selectedLabels = computed(() =>
  portfolio.services
    .filter((s) => serviceIds.value.includes(s.id))
    .map((s) => s.title),
)

const canSubmit = computed(
  () =>
    name.value.trim().length > 1 &&
    contact.value.trim().length > 2 &&
    message.value.trim().length > 2 &&
    !submitting.value,
)

async function onSubmit() {
  if (!canSubmit.value) return
  haptic('medium')
  submitting.value = true

  const payload: ContactPayload = {
    type: 'contact_request',
    name: name.value.trim(),
    contact: contact.value.trim(),
    message: message.value.trim(),
    services: selectedLabels.value,
    serviceIds: serviceIds.value,
    from: {
      id: user.value.id,
      username: user.value.username ?? null,
      first_name: user.value.first_name,
    },
    createdAt: new Date().toISOString(),
  }

  const ok = sendData(payload)
  submitting.value = false

  if (ok) {
    sent.value = true
    message.value = ''
    showAlert('Заявка отправлена! Я свяжусь с вами в ближайшее время.')
  }
}
</script>

<template>
  <section id="contact-form" class="px-4 pb-10">
    <div class="mb-3 flex items-center gap-2">
      <Send class="h-5 w-5 text-[var(--tg-theme-button-color)]" />
      <h2 class="text-lg font-semibold tracking-tight">Заявка</h2>
    </div>
    <p class="mb-4 text-sm text-[var(--tg-theme-hint-color)]">
      Опишите задачу — данные уйдут в бот через
      <code class="text-[var(--tg-theme-text-color)]">sendData</code>.
    </p>

    <form class="space-y-3" @submit.prevent="onSubmit">
      <label class="block">
        <span class="mb-1 block text-xs font-medium text-[var(--tg-theme-hint-color)]">
          Имя
        </span>
        <input
          v-model="name"
          type="text"
          required
          autocomplete="name"
          class="w-full rounded-xl bg-[var(--tg-theme-secondary-bg-color)] px-3.5 py-3 outline-none ring-1 ring-[var(--border-subtle)] focus:ring-[var(--tg-theme-button-color)]"
          placeholder="Как к вам обращаться"
        />
      </label>

      <label class="block">
        <span class="mb-1 block text-xs font-medium text-[var(--tg-theme-hint-color)]">
          Контакт
        </span>
        <input
          v-model="contact"
          type="text"
          required
          class="w-full rounded-xl bg-[var(--tg-theme-secondary-bg-color)] px-3.5 py-3 outline-none ring-1 ring-[var(--border-subtle)] focus:ring-[var(--tg-theme-button-color)]"
          placeholder="@username или email"
        />
      </label>

      <label class="block">
        <span class="mb-1 block text-xs font-medium text-[var(--tg-theme-hint-color)]">
          Сообщение
        </span>
        <textarea
          v-model="message"
          required
          rows="4"
          class="w-full resize-y rounded-xl bg-[var(--tg-theme-secondary-bg-color)] px-3.5 py-3 outline-none ring-1 ring-[var(--border-subtle)] focus:ring-[var(--tg-theme-button-color)]"
          placeholder="Кратко о проекте, сроках и бюджете"
        />
      </label>

      <div
        v-if="selectedLabels.length"
        class="rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-sm"
      >
        <span class="text-[var(--tg-theme-hint-color)]">Услуги: </span>
        {{ selectedLabels.join(', ') }}
      </div>

      <button
        type="submit"
        class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--tg-theme-button-color)] px-4 py-3.5 text-[15px] font-semibold text-[var(--tg-theme-button-text-color)] transition active:scale-[0.99] disabled:opacity-50"
        :disabled="!canSubmit"
      >
        <Send class="h-4 w-4" />
        {{ sent ? 'Отправить ещё' : 'Отправить заявку' }}
      </button>
    </form>

    <p class="mt-4 text-center text-xs text-[var(--tg-theme-hint-color)]">
      {{ portfolio.contacts.telegram }} · {{ portfolio.contacts.email }}
    </p>
  </section>
</template>
