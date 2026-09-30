<script setup lang="ts">
import type { LegalLanguage } from '@/legal'

const language = defineModel<LegalLanguage>({ required: true })

const options: { value: LegalLanguage; label: string }[] = [
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'English' }
]
</script>

<template>
  <div class="switch" role="group" aria-label="Sprache / Language">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :lang="option.value"
      :aria-pressed="language === option.value"
      @click="language = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
@reference "@/index.css";

.switch {
  display: inline-flex;
  margin-top: 2rem;
  padding: 3px;
  border: 1px solid rgb(255 255 255 / 0.3);
  border-radius: 999px;
}

button {
  padding: 0.3rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 300;
  color: var(--color-white);
  cursor: pointer;
  transition:
    background-color 150ms,
    color 150ms;
}

button:hover {
  background: rgb(255 255 255 / 0.12);
}

button[aria-pressed='true'] {
  background: var(--color-white);
  color: var(--color-shrink-me-secondary);
  font-weight: 600;
}

button:focus-visible {
  outline: 2px solid var(--color-shrink-me-primary);
  outline-offset: 2px;
}
</style>
