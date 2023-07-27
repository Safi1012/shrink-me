<template>
  <section
    id="what"
    class="grid auto-rows-[minmax(6em,auto)] grid-cols-[repeat(12,1fr)] justify-items-center gap-[2em_1.75em] bg-white"
  >
    <div class="desc text-center">
      <h1 class="mb-6">What?</h1>
      <p>
        What really makes <strong class="font-semibold">Shrink Me</strong> stand out, is that the
        service has: no Ads, is Free, is Fast and works Offline.
      </p>
    </div>

    <div
      class="card card-1 flex h-[15em] w-[11.25em] flex-col items-center justify-center rounded-[5px] bg-white px-[1em] py-[2em] text-center shadow-[0_4px_40px_0_#e8e8e89e]"
    >
      <img
        alt="Forbidden icon: A red circle with a diagonal line across it, symbolizing the prohibition of ads."
        src="@/assets/icons/forbidden.svg"
        class="h-7 w-7"
      />
      <h2 class="mb-3 mt-6">No Ads</h2>
      <p class="m-0 leading-[1.6em]">I believe in beautiful apps without any ads.</p>
    </div>

    <div
      class="card card-2 flex h-[15em] w-[11.25em] flex-col items-center justify-center rounded-[5px] bg-white px-[1em] py-[2em] text-center shadow-[0_4px_40px_0_#e8e8e89e]"
    >
      <img
        alt="Piggy bank icon: A piggy bank symbol, representing the availability of the service at no cost."
        src="@/assets/icons/free.svg"
        class="h-7 w-7"
      />
      <h2 class="mb-3 mt-6">Free</h2>
      <p class="m-0 leading-[1.6em]">Free to use for everyone. Compress as much as you like.</p>
    </div>

    <div
      class="card card-3 flex h-[15em] w-[11.25em] flex-col items-center justify-center rounded-[5px] bg-white px-[1em] py-[2em] text-center shadow-[0_4px_40px_0_#e8e8e89e]"
    >
      <img
        alt="Fast icon: A lightning bolt, symbolizing the high speed of the compression service."
        src="@/assets/icons/lightning.svg"
        class="h-7 w-7"
      />
      <h2 class="mb-3 mt-6">Fast</h2>
      <p class="m-0 leading-[1.6em]">It just takes a few seconds to compress your images.</p>
    </div>

    <div
      class="card card-4 flex h-[15em] w-[11.25em] flex-col items-center justify-center rounded-[5px] bg-white px-[1em] py-[2em] text-center shadow-[0_4px_40px_0_#e8e8e89e]"
    >
      <img
        alt="Wi-Fi icon: Depicting that the service works offline in any modern browser."
        src="@/assets/icons/wifi.svg"
        class="h-7 w-7"
      />
      <h2 class="mb-3 mt-6">Offline</h2>
      <p class="m-0 leading-[1.6em]">Shrink Me even works offline in any modern browser.</p>
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
