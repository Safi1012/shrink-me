<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section
    id="what"
    class="grid auto-rows-[minmax(6em,auto)] grid-cols-[repeat(12,1fr)] justify-items-center gap-[2em_1.75em] bg-white"
  >
    <div class="desc text-center">
      <h1 class="mb-6">{{ $t('home.what.headline') }}</h1>
      <p>
        {{ $t('home.what.description') }}
      </p>
    </div>

    <div
      class="card card-1 flex w-[11.25em] flex-col items-center justify-start rounded-[5px] bg-white px-[1em] py-[2em] text-center shadow-[0_4px_40px_0_#e8e8e89e]"
    >
      <img
        :alt="t('home.what.no_ads_image_alt')"
        src="@/assets/icons/forbidden.svg"
        class="h-7 w-7"
      />
      <h2 class="mb-3 mt-6">{{ $t('home.what.no_ads_headline') }}</h2>
      <p class="m-0 leading-[1.6em]">{{ $t('home.what.no_ads_description') }}</p>
    </div>

    <div
      class="card card-2 flex w-[11.25em] flex-col items-center justify-start rounded-[5px] bg-white px-[1em] py-[2em] text-center shadow-[0_4px_40px_0_#e8e8e89e]"
    >
      <img :alt="t('home.what.free_image_alt')" src="@/assets/icons/free.svg" class="h-7 w-7" />
      <h2 class="mb-3 mt-6">{{ $t('home.what.free_headline') }}</h2>
      <p class="m-0 leading-[1.6em]">{{ $t('home.what.free_description') }}</p>
    </div>

    <div
      class="card card-3 flex w-[11.25em] flex-col items-center justify-start rounded-[5px] bg-white px-[1em] py-[2em] text-center shadow-[0_4px_40px_0_#e8e8e89e]"
    >
      <img
        :alt="t('home.what.fast_image_alt')"
        src="@/assets/icons/lightning.svg"
        class="h-7 w-7"
      />
      <h2 class="mb-3 mt-6">{{ $t('home.what.fast_headline') }}</h2>
      <p class="m-0 leading-[1.6em]">{{ $t('home.what.fast_description') }}</p>
    </div>

    <div
      class="card card-4 flex w-[11.25em] flex-col items-center justify-start rounded-[5px] bg-white px-[1em] py-[2em] text-center shadow-[0_4px_40px_0_#e8e8e89e]"
    >
      <img :alt="t('home.what.offline_image_alt')" src="@/assets/icons/wifi.svg" class="h-7 w-7" />
      <h2 class="mb-3 mt-6">{{ $t('home.what.offline_headline') }}</h2>
      <p class="m-0 leading-[1.6em]">{{ $t('home.what.offline_description') }}</p>
    </div>
  </section>
</template>

<style scoped>
section {
  grid-template-areas:
    '.  .  .  .  .  .  .  .  .  .  .  .'
    '.  .  d  d  d  d  d  d  d  d  . .'
    '.  . c1 c1 c1 c1 c1 c1 c1 c1  . .'
    '.  . c2 c2 c2 c2 c2 c2 c2 c2  . .'
    '.  . c3 c3 c3 c3 c3 c3 c3 c3  . .'
    '.  . c4 c4 c4 c4 c4 c4 c4 c4  . .'
    '.  .  .  .  .  .  .  .  .  .  . .';
}

.desc {
  grid-area: d;
}

.card-1 {
  grid-area: c1;
}

.card-2 {
  grid-area: c2;
}

.card-3 {
  grid-area: c3;
}

.card-4 {
  grid-area: c4;
}

@media (min-width: 700px) {
  section {
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  d  d  d  d  d  d  d  d  d  d  .'
      '.  .  .  .  . c1 c2  .  .  .  .  .'
      '.  .  .  .  . c3 c4  .  .  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .';
  }
}

@media (min-width: 1150px) {
  section {
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  d  d  d  d  d  d  d  d  d  d  .'
      '.  .  .  . c1 c2 c3 c4  .  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .';
  }
}
</style>
