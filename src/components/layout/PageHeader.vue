<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

defineProps<{
  navItems: {
    title: string
    anchor: string
  }[]
}>()

const isMobile = ref(window.innerWidth <= 576)
const isMenuOpen = ref(false)
const hash = window.location.hash

console.log('navItems: ', isMobile.value, isMenuOpen, hash)
</script>

<template>
  <nav
    class="fixed z-10 mt-4 grid w-screen grid-cols-12 items-center justify-items-stretch bg-white pt-1"
  >
    <RouterLink to="/" class="logo text-l flex items-center">
      <img alt="Shrink Me logo" src="@/assets/icons/logo.svg" width="48" height="48" />
      <strong class="pt-1">Shrink<span class="text-shrink-me-primary">Me</span></strong>
    </RouterLink>

    <button
      v-if="isMobile"
      class="hamburger"
      name="menu"
      type="button"
      aria-label="Menu"
      @click="isMenuOpen = !isMenuOpen"
    >
      <img class="pt-1" alt="Menu icon" src="@/assets/icons/menu.svg" width="28" />
    </button>

    <ul v-show="!isMobile || isMenuOpen" class="items">
      <li v-for="item in navItems" :key="item.anchor">
        <div class="nav-entry">
          <RouterLink :to="item.anchor">{{ item.title }}</RouterLink>
        </div>
        <div :class="{ 'nav-marker-visible': hash === item.anchor }" class="nav-marker"></div>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  grid-template-areas: '. l l l l l l . . . h .';
}

.logo {
  grid-area: l;
}

.hamburger {
  grid-area: h;
}
</style>
