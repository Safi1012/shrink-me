<script setup lang="ts">
import PageFooter from '@/components/layout/PageFooter.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { operator } from '@/legal'
import { useEventListener } from '@vueuse/core'
import { onMounted, ref } from 'vue'

const iconName = ref('')

const updateIcon = () => {
  const viewportWidth = window.innerWidth

  switch (true) {
    case viewportWidth >= 1440:
      iconName.value = 'send-line-xl'
      break

    case viewportWidth >= 992:
      iconName.value = 'send-line-lg'
      break

    case viewportWidth >= 576:
      iconName.value = 'send-line-md'
      break

    default:
      iconName.value = 'send-line-sm'
  }
}

useEventListener('resize', () => {
  updateIcon()
})

onMounted(() => {
  updateIcon()
})
</script>

<template>
  <PageHeader />
  <main
    class="grid min-h-screen auto-rows-[minmax(2em,auto)] grid-cols-12 justify-items-stretch gap-[2em_0.75em]"
  >
    <div class="content">
      <h1 class="mb-8 text-center text-5xl font-light">{{ $t('contact.headline') }}</h1>
      <p class="mb-2">{{ $t('contact.description') }}</p>
      <strong>{{ operator.email }}</strong>
      <div class="mail mt-16">
        <a
          :href="`mailto:${operator.email}`"
          class="inline-flex items-center justify-center rounded-[3px] bg-shrink-me-primary px-[2.5em] py-[0.5em] shadow-[0_6px_30px_0_#adadadfa] transition-shadow duration-300 ease-[ease-in-out] hover:shadow-[0_2px_10px_0_#adadadfa]"
        >
          <strong class="text-white uppercase">{{ $t('contact.send_mail_link') }}</strong>
        </a>
      </div>
    </div>
    <img
      :alt="$t('contact.paper_plane_icon_alt')"
      :src="`/assets/icons/${iconName}.svg`"
      class="svg-icon h-auto w-auto"
    />
  </main>
  <PageFooter />
</template>

<style scoped>
main {
  grid-template-areas:
    '.  .  .  .  .  .  .  .  .  .  .  .'
    '.  .  .  .  .  .  .  .  .  .  .  .'
    '.  c  c  c  c  c  c  c  c  c  c  .'
    'i  i  i  i  i  i  i  i  i  i  .  .'
    '.  .  .  .  .  .  .  .  .  .  .  .';
}

.content {
  grid-area: c;
  text-align: center;
}

.svg-icon {
  grid-area: i;
}

@media (min-width: 992px) {
  main {
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  c  c  c  c  c  c  c  c  c  c  .'
      'i  i  i  i  i  i  i  i  .  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .';
  }
}
</style>
