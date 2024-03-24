<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <nav class="text-l fixed z-10 w-screen items-center justify-items-stretch bg-white py-3 pl-4">
      <RouterLink to="/" class="text-l flex items-center">
        <img alt="Shrink Me logo" src="@/assets/icons/logo.svg" class="h-12" />
        <strong class="pt-1">Shrink<span class="text-shrink-me-primary">Me</span></strong>
      </RouterLink>
    </nav>
  </header>
</template>
