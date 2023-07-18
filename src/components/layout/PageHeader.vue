<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useEventListener } from '@vueuse/core'

defineProps<{
  navItems: {
    title: string
    anchor: string
  }[]
}>()

const isMenuOpen = ref(false)
const isMobile = ref(false)
const hash = window.location.hash

useEventListener(window, 'resize', () => {
  isMobile.value = window.innerWidth <= 768
  isMenuOpen.value = false
})

onMounted(() => {
  isMobile.value = window.innerWidth <= 768
})
</script>

<template>
  <nav
    class="text-l fixed z-10 mt-4 grid w-screen grid-cols-12 items-center justify-items-stretch bg-white pt-1"
  >
    <RouterLink to="/" class="logo text-l flex items-center">
      <img alt="Shrink Me logo" src="@/assets/icons/logo.svg" class="h-12" />
      <strong class="pt-1">Shrink<span class="text-shrink-me-primary">Me</span></strong>
    </RouterLink>

    <button
      v-if="isMobile"
      class="hamburger mt-1"
      name="menu"
      type="button"
      aria-label="Menu"
      @click="isMenuOpen = !isMenuOpen"
    >
      <img class="p-1" alt="Menu icon" src="@/assets/icons/menu.svg" width="32" />
    </button>

    <ul
      v-show="!isMobile || isMenuOpen"
      class="items absolute top-14 z-10 m-0 flex h-48 w-screen list-none flex-col items-center justify-around bg-white pl-0 after:absolute after:bottom-0 after:h-[0.125em] after:w-screen after:bg-shrink-me-primary after:content-['_'] md:top-[inherit] md:h-[inherit] md:w-full md:flex-row md:justify-end md:after:hidden"
    >
      <li
        v-for="item in navItems"
        :key="item.anchor"
        class="md:px-[1em]"
        @click="isMenuOpen = !isMenuOpen"
      >
        <div
          class="nav-entry md:mb-[-0.125em] md:flex md:h-[3.5em] md:flex-[1_0_0] md:flex-col md:justify-center"
        >
          <RouterLink class="font-semibold text-black" :to="item.anchor">{{
            item.title
          }}</RouterLink>
        </div>
        <div
          :class="{ 'opacity-100': hash === item.anchor }"
          class="nav-marker h-[0.125em] w-auto bg-[$color-button] opacity-0"
        ></div>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.logo {
  grid-area: l;
}

.hamburger {
  grid-area: h;
}

.items {
  grid-area: i;
}

nav {
  grid-template-areas: '. l l l l l l . . . h .';
}

@media (min-width: 768px) {
  nav {
    grid-template-areas: '. l l l l l i i i i i .';
  }
}

@media (min-width: 976px) {
  nav {
    grid-template-areas: '. l . . . i i . . . . .';
  }
}
</style>
