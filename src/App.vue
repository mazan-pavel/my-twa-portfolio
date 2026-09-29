<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import Header from '@/components/Header.vue'
import StackBadges from '@/components/StackBadges.vue'
import Projects from '@/components/Projects.vue'
import Services from '@/components/Services.vue'
import ContactForm from '@/components/ContactForm.vue'
import { useTelegram } from '@/composables/useTelegram'

const { init } = useTelegram()
const selectedServiceIds = ref<string[]>([])

onMounted(() => {
  init()
})

function onSelectServices(ids: string[]) {
  selectedServiceIds.value = ids
}

async function onGoToForm(ids: string[]) {
  selectedServiceIds.value = ids
  await nextTick()
  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="mx-auto min-h-screen max-w-lg">
    <Header />
    <StackBadges />
    <Projects />
    <Services
      @select-services="onSelectServices"
      @go-to-form="onGoToForm"
    />
    <ContactForm :selected-service-ids="selectedServiceIds" />
  </div>
</template>
