<script setup lang="ts">
import { CircleCheck } from 'lucide-vue-next'
import { portfolio } from '@/data/portfolio'
import { useTelegram } from '@/composables/useTelegram'

const { user } = useTelegram()

const avatarLetter = (user.value.first_name?.[0] ?? portfolio.name[0]).toUpperCase()
</script>

<template>
  <header class="animate-fade-up relative overflow-hidden px-4 pb-6 pt-5">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--accent-soft)] to-transparent"
      aria-hidden="true"
    />

    <div class="relative flex items-start gap-3">
      <div
        class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] text-xl font-semibold text-[var(--tg-theme-button-color)] shadow-sm ring-1 ring-[var(--border-subtle)]"
      >
        <img
          v-if="user.photo_url"
          :src="user.photo_url"
          :alt="user.first_name"
          class="h-full w-full object-cover"
        />
        <span v-else>{{ avatarLetter }}</span>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="truncate text-2xl font-semibold tracking-tight">
            {{ portfolio.name }}
          </h1>
          <span
            class="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--tg-theme-button-color)]"
          >
            <CircleCheck class="h-3.5 w-3.5" aria-hidden="true" />
            {{ portfolio.availability }}
          </span>
        </div>
        <p class="mt-0.5 text-sm text-[var(--tg-theme-hint-color)]">
          {{ portfolio.role }}
        </p>
        <p
          v-if="user.username"
          class="mt-1 text-xs text-[var(--tg-theme-hint-color)]"
        >
          Привет, {{ user.first_name }}
          <span v-if="user.username">(@{{ user.username }})</span>
        </p>
      </div>
    </div>

    <p class="relative mt-4 text-[15px] leading-relaxed text-[var(--tg-theme-text-color)]/90">
      {{ portfolio.bio }}
    </p>
  </header>
</template>
