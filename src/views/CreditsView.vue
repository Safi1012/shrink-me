<script setup lang="ts">
import PageFooter from '@/components/layout/PageFooter.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
</script>

<template>
  <PageHeader />

  <article
    class="grid auto-rows-[minmax(2em,auto)] grid-cols-[repeat(12,1fr)] justify-items-stretch gap-[2em_0.75em]"
  >
    <section>
      <h1>{{ $t('credits.headline_credits') }}</h1>
      <p>
        {{ $t('credits.description_marco') }}
      </p>

      <p>
        {{ $t('credits.description_open_source') }}
      </p>

      <section class="center">
        <h1>{{ $t('credits.headline_image') }}</h1>

        <a href="https://unsplash.com/@sotti" target="_blank" rel="noopener">
          <h3>Shifaaz shamoon</h3>
        </a>
        <a
          href="https://unsplash.com/photos/sLAk1guBG90"
          target="_blank"
          rel="noopener"
          class="wrap"
        >
          https://unsplash.com/photos/sLAk1guBG90
        </a>
      </section>

      <section class="center">
        <h1>{{ $t('credits.headline_icons') }}</h1>

        <a href="https://www.flaticon.com/authors/iconnice" target="_blank" rel="noopener">
          <h3>iconnice</h3>
        </a>
        <a href="https://www.flaticon.com/free-icon/wifi_131145" target="_blank" rel="noopener">
          https://www.flaticon.com/free-icon/wifi_131145
        </a>

        <a href="https://www.flaticon.com/authors/gregor-cresnar" target="_blank" rel="noopener">
          <h3>Gregor Cresnar</h3>
        </a>
        <a
          href="https://www.flaticon.com/free-icon/piggy-bank_179956"
          target="_blank"
          rel="noopener"
        >
          https://www.flaticon.com/free-icon/piggy-bank_179956
        </a>
        <a
          href="https://www.flaticon.com/free-icon/forbidden_159688"
          target="_blank"
          rel="noopener"
        >
          https://www.flaticon.com/free-icon/forbidden_159688
        </a>

        <a href="https://www.flaticon.com/authors/freepik" target="_blank" rel="noopener">
          <h3>Freepik</h3>
        </a>
        <a href="https://www.flaticon.com/free-icon/sent-mail_71746" target="_blank" rel="noopener">
          https://www.flaticon.com/free-icon/sent-mail_71746
        </a>
        <a href="https://www.flaticon.com/free-icon/shield_748276" target="_blank" rel="noopener">
          https://www.flaticon.com/free-icon/shield_748276
        </a>
      </section>

      <section>
        <h1>{{ $t('credits.headline_oss') }}</h1>

        <a href="https://github.com/xkeshi/image-compressor" target="_blank" rel="noopener">
          <h3>image-compressor</h3>
        </a>
        <p>The MIT License (MIT)</p>
        <p>Copyright 2017-present Xkeshi</p>
        <p>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </p>
        <p>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
          INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
          FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
          DEALINGS IN THE SOFTWARE.
        </p>

        <a href="https://github.com/svg/svgo" target="_blank" rel="noopener">
          <h3>svgo</h3>
        </a>
        <p>The MIT License (MIT)</p>
        <p>Copyright 2012–2016 Kir Belevich</p>
        <p>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </p>
        <p>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
          INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
          FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
          DEALINGS IN THE SOFTWARE.
        </p>

        <a href="https://github.com/Stuk/jszip" target="_blank" rel="noopener">
          <h3>JSZip</h3>
        </a>
        <p>The MIT License (MIT)</p>
        <p>
          Copyright 2009-2016 Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso
        </p>
        <p>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </p>
        <p>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
          INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
          FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
          DEALINGS IN THE SOFTWARE.
        </p>

        <a href="https://github.com/vuejs/vue" target="_blank" rel="noopener">
          <h3>vue, vue-cli, vue-router</h3>
        </a>
        <p>The MIT License (MIT)</p>
        <p>Copyright (c) 2013-present, Yuxi (Evan) You</p>
        <p>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </p>
        <p>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
          INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
          FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
          DEALINGS IN THE SOFTWARE.
        </p>

        <a href="https://github.com/juliangarnier/anime" target="_blank" rel="noopener">
          <h3>anime.js</h3>
        </a>
        <p>The MIT License (MIT)</p>
        <p>Copyright (c) 2017 Julian Garnier</p>
        <p>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </p>
        <p>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
          INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
          FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
          DEALINGS IN THE SOFTWARE.
        </p>
      </section>
    </section>
  </article>

  <PageFooter />
</template>

<style scoped>
article {
  grid-template-areas:
    '.  .  .  .  .  .  .  .  .  .  .  .'
    '.  c  c  c  c  c  c  c  c  c  c  .'
    '.  .  .  .  .  .  .  .  .  .  .  .';
}

a {
  @apply text-base font-light text-[#48bfcd] no-underline;
}

section {
  grid-area: c;
  margin-top: 4em;
}

section:not(:first-child) {
  @apply mt-24;
}

h1,
h2,
h3 {
  text-align: center;
  @apply mb-4 text-shrink-me-secondary;
}

h3 {
  margin-bottom: 0.25em;
  margin-top: 2em;
}

p {
  @apply mb-4 text-justify;
}

.wrap {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
}

.center {
  text-align: center;
}

@media (min-width: 576px) {
  article {
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  c  c  c  c  c  c  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .';
  }
}

@media (min-width: 992px) {
  article {
    grid-template-areas:
      '.  .  .  .  .  .  .  .  .  .  .  .'
      '.  .  .  .  c  c  c  c  .  .  .  .'
      '.  .  .  .  .  .  .  .  .  .  .  .';
  }
}
</style>
