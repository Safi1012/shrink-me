<template>
  <section
    id="faq"
    class="grid auto-rows-[minmax(6em,auto)] grid-cols-12 justify-items-center gap-[2em_0.75em] bg-[#032c30]"
  >
    <div>
      <h1 class="text-center text-white">{{ $t('home.faq.headline') }}</h1>

      <article class="free my-[4em] mb-[2em] text-center text-white">
        <h2 class="mb-5">{{ $t('home.faq.faq_headline_1') }}</h2>
        <p>
          {{ $t('home.faq.faq_description_1') }} <br />
          {{ $t('home.faq.faq_description_11') }}
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">{{ $t('home.faq.faq_headline_2') }}</h2>
        <p>
          {{ $t('home.faq.faq_description_2') }} <br />
          {{ $t('home.faq.faq_description_22') }}
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">{{ $t('home.faq.faq_headline_3') }}</h2>
        <p>
          {{ $t('home.faq.faq_description_3') }} <br />
          {{ $t('home.faq.faq_description_33') }}
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">{{ $t('home.faq.faq_headline_4') }}</h2>
        <p>
          {{ $t('home.faq.faq_description_4') }} <br />
          {{ $t('home.faq.faq_description_44') }}
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">{{ $t('home.faq.faq_headline_5') }}</h2>
        <p>
          {{ $t('home.faq.faq_description_5') }} <br />
          {{ $t('home.faq.faq_description_55') }}
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">{{ $t('home.faq.faq_headline_6') }}</h2>
        <p>
          {{ $t('home.faq.faq_description_6') }}
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">{{ $t('home.faq.faq_headline_7') }}</h2>
        <p>
          {{ $t('home.faq.faq_description_7') }}
        </p>
      </article>

      <article class="free my-[4em] mb-[2em] text-center text-white">
        <h2 class="mb-5">{{ $t('home.faq.faq_headline_8') }}</h2>
        <p>
          {{ $t('home.faq.faq_description_8') }}
        </p>
        <a
          class="bmc mt-[2em] inline-flex items-center justify-center rounded-[5px] bg-[#ff813f] p-[0.6em] text-sm shadow-[0_6px_20px_0_#190d0d] transition-shadow duration-150 ease-[ease-in-out] hover:shadow-[0_0_0_0_#034e56]"
          target="_blank"
          rel="noopener nofollow"
          href="https://www.paypal.me/filipecorrea"
        >
          <img
            alt="Buy me a coffee: A heartwarming gesture of support with a cup of coffee."
            src="@/assets/icons/buy-me-coffee.svg"
            class="h-7 w-7"
          />
          <span class="ml-2 text-white">Buy me a coffee</span>
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
