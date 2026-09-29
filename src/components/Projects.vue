<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { portfolio } from '@/data/portfolio'
import type { Project, ProjectCategory } from '@/types'
import { useTelegram } from '@/composables/useTelegram'
import ProjectModal from './ProjectModal.vue'

const filters: Array<'Все' | ProjectCategory> = ['Все', 'TWA', 'Web', 'Backend']
const activeFilter = ref<(typeof filters)[number]>('Все')
const selected = ref<Project | null>(null)
const { haptic } = useTelegram()

const filtered = computed(() => {
  if (activeFilter.value === 'Все') return portfolio.projects
  return portfolio.projects.filter((p) => p.category === activeFilter.value)
})

function setFilter(filter: (typeof filters)[number]) {
  haptic('light')
  activeFilter.value = filter
}

function openProject(project: Project) {
  haptic('medium')
  selected.value = project
}

function closeModal() {
  selected.value = null
}
</script>

<template>
  <section class="px-4 pb-6">
    <div class="mb-3 flex items-end justify-between gap-2">
      <h2 class="text-lg font-semibold tracking-tight">Проекты</h2>
      <span class="text-xs text-[var(--tg-theme-hint-color)]">
        {{ filtered.length }}
      </span>
    </div>

    <div class="mb-4 flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition"
        :class="
          activeFilter === filter
            ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]'
            : 'bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] ring-1 ring-[var(--border-subtle)]'
        "
        @click="setFilter(filter)"
      >
        {{ filter }}
      </button>
    </div>

    <ul class="space-y-2.5">
      <li v-for="(project, index) in filtered" :key="project.id">
        <button
          type="button"
          class="animate-fade-up group flex w-full items-center gap-3 rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] p-3.5 text-left ring-1 ring-[var(--border-subtle)] transition hover:brightness-[1.02] active:scale-[0.99]"
          :style="{ animationDelay: `${index * 50}ms` }"
          @click="openProject(project)"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span
                class="rounded-md bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--tg-theme-button-color)]"
              >
                {{ project.category }}
              </span>
              <h3 class="truncate text-[15px] font-semibold">{{ project.title }}</h3>
            </div>
            <p class="mt-1 line-clamp-2 text-sm text-[var(--tg-theme-hint-color)]">
              {{ project.shortDescription }}
            </p>
          </div>
          <ChevronRight
            class="h-5 w-5 shrink-0 text-[var(--tg-theme-hint-color)] transition group-hover:translate-x-0.5"
          />
        </button>
      </li>
    </ul>

    <ProjectModal
      v-if="selected"
      :project="selected"
      @close="closeModal"
    />
  </section>
</template>
