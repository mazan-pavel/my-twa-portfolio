<script setup lang="ts">
import { portfolio } from '@/data/portfolio'
</script>

<template>
  <section class="px-4 pb-6">
    <h2 class="mb-3 text-lg font-semibold tracking-tight">Стек</h2>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(tech, index) in portfolio.stack"
        :key="tech"
        class="animate-fade-up rounded-xl bg-[var(--tg-theme-secondary-bg-color)] px-3 py-1.5 text-sm text-[var(--tg-theme-text-color)] ring-1 ring-[var(--border-subtle)]"
        :style="{ animationDelay: `${index * 40}ms` }"
      >
        {{ tech }}
      </span>
    </div>
  </section>
</template>
