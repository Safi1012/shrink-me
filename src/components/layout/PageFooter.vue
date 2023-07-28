<script setup lang="ts">
import { version } from '../../../package.json'

const getVersion = () => {
  return window.location.pathname.includes('contact') ? `Version: ${version}` : ''
}
</script>

<template>
  <footer>
    <nav
      class="grid auto-rows-[minmax(3em,auto)] grid-cols-[repeat(12,1fr)] justify-items-stretch gap-[2em_0.75em] bg-white"
    >
      <ul class="flex list-none flex-row justify-between pl-0">
        <li>
          <router-link to="/privacy">Privacy</router-link>
        </li>
        <li>
          <span class="s1">|</span>
        </li>
        <li>
          <router-link to="/legal">Legal</router-link>
        </li>
        <li>
          <span class>|</span>
        </li>
        <li>
          <router-link to="/credits">Credits</router-link>
        </li>
        <li>
          <span>|</span>
        </li>
        <li>
          <router-link to="/contact">Contact</router-link>
        </li>
      </ul>

      <div class="information mx-0 mb-6 mt-2 flex items-end justify-between text-base">
        <div>
          <h1 class="mb-1 text-sm text-[#9b9b9b]">Copyright © {{ new Date().getFullYear() }}</h1>
          <a
            href="https://filipesantoscorrea.com"
            target="_blank"
            rel="noopener"
            class="hover:text-[#9b9b9b]"
            >Filipe Santos Correa</a
          >
        </div>
        <p class="m-0 text-right text-sm font-semibold text-[#9b9b9b]">{{ getVersion() }}</p>
      </div>
    </nav>
  </footer>
</template>

<style scoped>
nav {
  grid-template-areas:
    '.  .  .  .  .  .  .  .  .  .  .  .'
    '.  c  c  c  c  c  c  c  c  c  c  .'
    '.  h  h  h  h  h  h  h  h  h  h  .';
}

ul {
  grid-area: c;
}

.information {
  grid-area: h;
}

@media (min-width: 992px) {
  nav {
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  c  c  c  c  c  c  .  .  .'
      '.  .  .  h  h  h  h  h  h  .  .  .';
  }
}

@media (min-width: 1440px) {
  nav {
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  .  c  c  c  c  .  .  .  .'
      '.  .  .  .  h  h  h  h  .  .  .  .';
  }
}
</style>
