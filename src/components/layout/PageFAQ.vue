<template>
  <section
    id="faq"
    class="grid auto-rows-[minmax(6em,auto)] grid-cols-[repeat(12,1fr)] justify-items-center gap-[2em_0.75em] bg-[#032c30]"
  >
    <div>
      <h1 class="text-center text-white">FAQs</h1>

      <article class="free my-[4em] mb-[2em] text-center text-white">
        <h2 class="mb-5">Why is it free?</h2>
        <p>
          I created Shrink Me in order to compress my own images in a fun and intuitive way. <br />
          I also love to create new product experiences in order to extend and refresh my developer
          knowledge.
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">Why should I compress images?</h2>
        <p>
          Image compression is ideal if you want to make your site / app load faster or to save some
          storage.
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">Do compressed images suffer from quality loss?</h2>
        <p>
          No, your images should look identical to the human eye.<br />
          You almost won't see any differences, just give it a try.
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">What Compression Quality is used for JPG and WEBP images?</h2>
        <p>
          Shrink Me's compression quality for JPG and WEBP images is 60%. <br />
          In the future, you will be able to change this value.
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">What is the maximum file size?</h2>
        <p>
          Currently there is no maximum file size limit. <br />
          Beware that big file sizes will take longer to compress.
        </p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">Can I compress multiple files at once?</h2>
        <p>Yes, you can shrink as many as you like at once.</p>
      </article>

      <article class="my-[4em] text-center text-white">
        <h2 class="mb-5">Why didn't my image get any smaller?</h2>
        <p>This may happen to images which already have been optimized.</p>
      </article>

      <article class="free my-[4em] mb-[2em] text-center text-white">
        <h2 class="mb-5">Shrink Me? ❤️</h2>
        <p>
          If you truly enjoy using Shrink Me, please consider supporting me with a cup of coffee.
        </p>
        <a
          class="bmc mt-[2em] inline-flex items-center justify-center rounded-[5px] bg-[#ff813f] p-[0.6em] text-sm shadow-[0_6px_20px_0_#190d0d] transition-shadow duration-[0.15s] ease-[ease-in-out] hover:shadow-[0_0_0_0_#034e56]"
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
