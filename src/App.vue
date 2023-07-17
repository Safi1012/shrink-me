<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <img alt="Shrink Me logo" src="@/assets/icons/logo.svg" width="125" height="125" />

  <header>
    <nav class="bg-shrink-me-primary">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/privacy">Privacy</RouterLink>
      <RouterLink to="/legal">Legal</RouterLink>
      <RouterLink to="/credits">Credits</RouterLink>
      <RouterLink to="/contact">Contact</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
</style>
