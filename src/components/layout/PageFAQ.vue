<script setup lang="ts">
const questions = [
  'free',
  'why_compress',
  'quality_loss',
  'quality_setting',
  'max_size',
  'multiple_files',
  'not_smaller'
] as const
</script>

<template>
  <section
    id="faq"
    class="grid auto-rows-[minmax(6em,auto)] grid-cols-12 justify-items-center gap-[2em_0.75em] bg-[#032c30]"
  >
    <div>
      <h1 class="text-center text-white">{{ $t('home.faq.headline') }}</h1>

      <article
        v-for="(id, index) in questions"
        :key="id"
        class="my-[4em] text-center text-white"
        :class="{ 'free mb-[2em]': index === 0 }"
      >
        <h2 class="mb-5">{{ $t(`home.faq.${id}.question`) }}</h2>
        <!-- Answers break into lines where the translation puts a line break -->
        <p class="whitespace-pre-line">{{ $t(`home.faq.${id}.answer`) }}</p>
      </article>

      <article class="free my-[4em] mb-[2em] text-center text-white">
        <h2 class="mb-5">{{ $t('home.faq.support.question') }}</h2>
        <p>
          {{ $t('home.faq.support.answer') }}
        </p>
        <a
          class="bmc mt-[2em] inline-flex items-center justify-center rounded-[5px] bg-[#ff813f] p-[0.6em] text-sm shadow-[0_6px_20px_0_#190d0d] transition-shadow duration-150 ease-[ease-in-out] hover:shadow-[0_0_0_0_#034e56]"
          target="_blank"
          rel="noopener nofollow"
          href="https://www.paypal.me/filipecorrea"
        >
          <img alt="" src="@/assets/icons/buy-me-coffee.svg" class="h-7 w-7" />
          <span class="ms-2 text-white">{{ $t('home.faq.support.button') }}</span>
        </a>
      </article>
    </div>
  </section>
</template>

<style scoped>
section {
  grid-template-areas:
    '.  .  .  .  .  .  .  .  .  .  .  .'
    '.  c  c  c  c  c  c  c  c  c  c  .'
    '.  .  .  .  .  .  .  .  .  .  . .';
}

div {
  grid-area: c;
}
</style>
