<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Calculator } from 'lucide-vue-next'
import { formatPrice, portfolio } from '@/data/portfolio'
import { useTelegram } from '@/composables/useTelegram'

const emit = defineEmits<{
  'select-services': [serviceIds: string[]]
  'go-to-form': [serviceIds: string[]]
}>()

const { haptic } = useTelegram()
const selectedIds = ref<string[]>([])

const total = computed(() =>
  portfolio.services
    .filter((s) => selectedIds.value.includes(s.id))
    .reduce((sum, s) => sum + s.priceFrom, 0),
)

function toggle(id: string) {
  haptic('light')
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id)
  } else {
    selectedIds.value = [...selectedIds.value, id]
  }
}

function goToForm() {
  haptic('medium')
  const ids = [...selectedIds.value]
  emit('select-services', ids)
  emit('go-to-form', ids)
}

watch(selectedIds, (ids) => emit('select-services', [...ids]), { deep: true })
</script>

<template>
  <section class="px-4 pb-6">
    <div class="mb-3 flex items-center gap-2">
      <Calculator class="h-5 w-5 text-[var(--tg-theme-button-color)]" />
      <h2 class="text-lg font-semibold tracking-tight">Услуги</h2>
    </div>
    <p class="mb-4 text-sm text-[var(--tg-theme-hint-color)]">
      Выберите услуги — сумма ориентировочная «от».
    </p>

    <ul class="space-y-2.5">
      <li v-for="service in portfolio.services" :key="service.id">
        <label
          class="flex cursor-pointer items-start gap-3 rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] p-3.5 ring-1 transition"
          :class="
            selectedIds.includes(service.id)
              ? 'ring-[var(--tg-theme-button-color)]'
              : 'ring-[var(--border-subtle)]'
          "
        >
          <input
            type="checkbox"
            class="mt-1 h-4 w-4 accent-[var(--tg-theme-button-color)]"
            :checked="selectedIds.includes(service.id)"
            @change="toggle(service.id)"
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline justify-between gap-2">
              <span class="font-semibold">{{ service.title }}</span>
              <span class="shrink-0 text-sm font-medium text-[var(--tg-theme-button-color)]">
                {{ service.unit }} {{ formatPrice(service.priceFrom) }}
              </span>
            </div>
            <p class="mt-1 text-sm text-[var(--tg-theme-hint-color)]">
              {{ service.description }}
            </p>
          </div>
        </label>
      </li>
    </ul>

    <div
      class="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[var(--accent-soft)] px-4 py-3"
    >
      <div>
        <p class="text-xs text-[var(--tg-theme-hint-color)]">Итого (ориентир)</p>
        <p class="text-lg font-semibold">{{ formatPrice(total) }}</p>
      </div>
      <button
        type="button"
        class="rounded-xl bg-[var(--tg-theme-button-color)] px-4 py-2.5 text-sm font-semibold text-[var(--tg-theme-button-text-color)] disabled:opacity-50"
        :disabled="selectedIds.length === 0"
        @click="goToForm"
      >
        К заявке
      </button>
    </div>
  </section>
</template>
