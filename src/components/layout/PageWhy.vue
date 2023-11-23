<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ImageDiff from '../shared/ImageDiff.vue'

const { t } = useI18n()
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
        <h1 class="mb-6 leading-[1.6em] text-white">{{ $t('home.why.headline') }}</h1>
        <p class="leading-[1.6em] text-white">
          {{ $t('home.why.description_top') }}
          <br />
        </p>

        <p class="more-text leading-[1.6em] text-white">
          <br />
          {{ $t('home.why.description_bottom') }}
        </p>
      </div>

      <ImageDiff
        class="original lg:mr-0 lg:mt-[-5em]"
        :headline="t('home.why.image_before')"
        :image-type="'original'"
      />
      <ImageDiff
        class="compressed lg:mt-0"
        :headline="t('home.why.image_after')"
        :image-type="'compressed'"
      />
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
