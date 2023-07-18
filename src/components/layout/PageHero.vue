<script setup lang="ts">
import FileManager from '@/components/shared/FileManager.vue'
import DisplayCounter from '@/components/shared/DisplayCounter.vue'
</script>

<template>
  <section class="grid auto-rows-[minmax(6em,auto)] grid-cols-12 gap-[2em_0.75em]">
    <FileManager class="file-manager" />
    <DisplayCounter class="display-counter hidden md:block" />
  </section>
</template>

<style scoped>
.file-manager {
  grid-area: c;
}

.display-counter {
  grid-area: d;
  text-align: center;
}

section {
  grid-template-areas:
    '.  .  .  .  .  .  .  .  .  .  .  .'
    '.  c  c  c  c  c  c  c  c  c  c  .'
    '.  .  .  .  .  .  .  .  .  .  .  .';
}

@media (min-width: 480px) {
  section {
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  c  c  c  c  c  c  c  c  .  .'
      '.  d  d  d  d  d  d  d  d  d  d  .'
      '.  .  .  .  .  .  .  .  .  .  .  .';
  }
}

@media (min-width: 976px) {
  section {
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  c  c  c  c  c  c  .  .  .'
      '.  .  d  d  d  d  d  d  d  d  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .';
  }
}

@media (min-width: 1440px) {
  section {
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  .  c  c  c  c  .  .  .  .'
      '.  .  .  d  d  d  d  d  d  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .';
  }
}
</style>
