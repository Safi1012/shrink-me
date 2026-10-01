<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { chooseLocale, locales, type Locale } from '@/i18n'

const { locale } = useI18n()

const onChange = (e: Event) => chooseLocale((e.target as HTMLSelectElement).value as Locale)
</script>

<template>
  <div
    class="relative inline-flex h-6 items-center gap-1.5 text-sm font-semibold text-[#9b9b9b] hover:text-shrink-me-secondary"
  >
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke-width="1.75" />
      <path
        d="M3 12h18M12 3c2.5 2.6 3.75 5.6 3.75 9s-1.25 6.4-3.75 9c-2.5-2.6-3.75-5.6-3.75-9S9.5 5.6 12 3Z"
        stroke-width="1.75"
      />
    </svg>
    <select
      :value="locale"
      :aria-label="$t('navigation.language')"
      class="cursor-pointer appearance-none bg-transparent pe-4 focus-visible:outline-2 focus-visible:outline-shrink-me-primary"
      @change="onChange"
    >
      <option v-for="option in locales" :key="option.code" :value="option.code" :lang="option.code">
        {{ option.name }}
      </option>
    </select>
    <svg
      viewBox="0 0 12 12"
      class="pointer-events-none absolute end-0 h-3 w-3"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5z" />
    </svg>
  </div>
</template>
