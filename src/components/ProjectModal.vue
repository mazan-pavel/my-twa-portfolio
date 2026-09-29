<script setup lang="ts">
import { ExternalLink, Github, X } from 'lucide-vue-next'
import type { Project } from '@/types'
import { useTelegram } from '@/composables/useTelegram'

defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  close: []
}>()

const { haptic } = useTelegram()

function onClose() {
  haptic('light')
  emit('close')
}

function onBackdrop(event: MouseEvent) {
  if (event.target === event.currentTarget) onClose()
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
    role="dialog"
    aria-modal="true"
    :aria-label="project.title"
    @click="onBackdrop"
  >
    <div
      class="animate-scale-in max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-[var(--tg-theme-bg-color)] p-5 shadow-xl sm:max-w-lg sm:rounded-3xl"
    >
      <div class="mb-4 flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-[var(--tg-theme-hint-color)]">
            {{ project.category }}
          </p>
          <h3 class="mt-1 text-xl font-semibold">{{ project.title }}</h3>
        </div>
        <button
          type="button"
          class="rounded-xl bg-[var(--tg-theme-secondary-bg-color)] p-2 text-[var(--tg-theme-hint-color)] transition hover:text-[var(--tg-theme-text-color)]"
          aria-label="Закрыть"
          @click="onClose"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <p class="text-[15px] leading-relaxed text-[var(--tg-theme-text-color)]/90">
        {{ project.description }}
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="item in project.stack"
          :key="item"
          class="rounded-lg bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--tg-theme-button-color)]"
        >
          {{ item }}
        </span>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <a
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-xl bg-[var(--tg-theme-secondary-bg-color)] px-3 py-2 text-sm font-medium ring-1 ring-[var(--border-subtle)]"
          @click="haptic('light')"
        >
          <Github class="h-4 w-4" />
          GitHub
        </a>
        <a
          :href="project.demoUrl"
          class="inline-flex items-center gap-2 rounded-xl bg-[var(--tg-theme-button-color)] px-3 py-2 text-sm font-medium text-[var(--tg-theme-button-text-color)]"
          @click="haptic('light')"
        >
          <ExternalLink class="h-4 w-4" />
          Demo
        </a>
      </div>
    </div>
  </div>
</template>
