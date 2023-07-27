<script setup lang="ts">
import ImageDiff from '../shared/ImageDiff.vue'
</script>

<template>
  <div
    class="root mb-[-10.5em] lg:mb-0 lg:flex lg:h-[33em] lg:justify-center lg:bg-shrink-me-secondary"
  >
    <section
      id="why"
      class="grid auto-rows-[minmax(6em,auto)] grid-cols-[repeat(12,1fr)] justify-items-stretch gap-[2em_0.75em] overflow-hidden bg-shrink-me-secondary lg:max-w-[62em] lg:overflow-visible"
    >
      <div class="desc mt-[5em]">
        <h1 class="mb-6 leading-[1.6em] text-white">Why?</h1>
        <p class="leading-[1.6em] text-white">
          With <strong class="leading-[1.6em] text-white">Shrink Me</strong> you can reduce your
          image file sizes without suffering visual quality loss, and thus make your sites and apps
          faster for your users. <br />
        </p>

        <p class="more-text leading-[1.6em] text-white">
          <br />
          As the following two images show, it is almost impossible for the human eye to find any
          visual distinctions.
        </p>
      </div>

      <ImageDiff
        class="original lg:mr-0 lg:mt-[-5em]"
        :headline="'BEFORE'"
        :image-type="'original'"
      />
      <ImageDiff class="compressed lg:mt-0" :headline="'AFTER'" :image-type="'compressed'" />
    </section>
  </div>
</template>

<style scoped>
.desc {
  grid-area: d;
}
.showcase {
  grid-area: s;
}
.original {
  grid-area: o;
}
.compressed {
  grid-area: c;
}

section {
  grid-template-areas:
    '.  d  d  d  d  d  d  d  d  d  d  .'
    '.  o  o  o  o  o  o  o  o  o  o  .'
    '.  c  c  c  c  c  c  c  c  c  c  .'
    '.  .  .  .  .  .  .  .  .  .  .  .';
}

img {
  width: 100%;
  height: auto;
}

@media (min-width: 992px) {
  section {
    grid-template-areas:
      '.  d  d  d  d  o  o  o  o  o  o  o'
      '.  d  d  d  d  .  .  .  .  .  .  .'
      '.  .  .  .  .  c  c  c  c  c  c  c'
      '.  .  .  .  .  .  .  .  .  .  .  .';
  }
}
</style>
