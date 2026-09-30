<script setup lang="ts">
import { operator } from '@/legal'

defineProps<{ emailLabel: string }>()
</script>

<template>
  <address class="operator">
    <strong>{{ operator.name }}</strong>
    <span>{{ operator.street }}</span>
    <span>{{ operator.postalCode }} {{ operator.city }}</span>
    <span>{{ operator.country }}</span>
    <span class="email">
      {{ emailLabel }}
      <a :href="`mailto:${operator.email}`">{{ operator.email }}</a>
    </span>
  </address>
</template>

<style scoped>
.operator {
  display: flex;
  flex-direction: column;
  margin: 1.25rem 0 1.5rem;
  padding-left: 1.25rem;
  border-left: 3px solid var(--color-shrink-me-primary);
  font-style: normal;
  font-weight: 300;
  line-height: 1.7;
}

.operator strong {
  color: var(--color-shrink-me-secondary);
}

.email {
  margin-top: 0.75rem;
}
</style>
