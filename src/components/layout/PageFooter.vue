<script setup lang="ts">
import { version } from '../../../package.json'
import { useRoute } from 'vue-router'
import LanguageSelect from '@/components/shared/LanguageSelect.vue'

const route = useRoute()
</script>

<template>
  <footer>
    <nav
      class="grid auto-rows-[minmax(3em,auto)] grid-cols-12 justify-items-stretch gap-[2em_0.75em] bg-white"
    >
      <ul class="flex list-none flex-row justify-between pl-0">
        <li>
          <router-link to="/privacy">{{ $t('navigation.privacy') }}</router-link>
        </li>
        <li>
          <span class="s1">|</span>
        </li>
        <li>
          <router-link to="/legal">{{ $t('navigation.legal') }}</router-link>
        </li>
        <li>
          <span>|</span>
        </li>
        <li>
          <router-link to="/credits">{{ $t('navigation.credits') }}</router-link>
        </li>
        <li>
          <span>|</span>
        </li>
        <li>
          <a href="https://github.com/Safi1012/shrink-me" target="_blank" rel="noopener">GitHub</a>
        </li>
        <li>
          <span>|</span>
        </li>
        <li>
          <router-link to="/contact">{{ $t('navigation.contact') }}</router-link>
        </li>
      </ul>

      <div class="information mx-0 mt-2 mb-6 flex items-end justify-between text-base">
        <div>
          <h1 class="mb-1 text-sm text-[#9b9b9b]">
            {{ $t('navigation.copyright', { year: new Date().getFullYear() }) }}
          </h1>
          <a
            href="https://filipesantoscorrea.com"
            target="_blank"
            rel="noopener"
            class="hover:text-[#9b9b9b]"
            >Filipe Santos Correa</a
          >
        </div>
        <div class="flex flex-col items-end gap-2">
          <router-link
            v-if="route.name === 'contact'"
            to="/changelog"
            class="m-0 text-end text-sm font-semibold text-[#9b9b9b] hover:text-shrink-me-secondary"
            >{{ $t('navigation.version', { version }) }}</router-link
          >
          <LanguageSelect />
        </div>
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
