<script setup lang="ts">
import LegalPage from '@/components/layout/LegalPage.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type Credit = { name: string; url: string; license: string; copyright: string }

const icons = [
  {
    author: 'iconnice',
    authorUrl: 'https://www.flaticon.com/authors/iconnice',
    works: [{ name: 'Wi-Fi', url: 'https://www.flaticon.com/free-icon/wifi_131145' }]
  },
  {
    author: 'Gregor Cresnar',
    authorUrl: 'https://www.flaticon.com/authors/gregor-cresnar',
    works: [
      { name: 'Piggy bank', url: 'https://www.flaticon.com/free-icon/piggy-bank_179956' },
      { name: 'Forbidden', url: 'https://www.flaticon.com/free-icon/forbidden_159688' }
    ]
  },
  {
    author: 'Freepik',
    authorUrl: 'https://www.flaticon.com/authors/freepik',
    works: [
      { name: 'Sent mail', url: 'https://www.flaticon.com/free-icon/sent-mail_71746' },
      { name: 'Shield', url: 'https://www.flaticon.com/free-icon/shield_748276' }
    ]
  }
]

const packages: Credit[] = [
  {
    name: 'Vue',
    url: 'https://github.com/vuejs/core',
    license: 'MIT',
    copyright: 'Copyright (c) 2018-present, Yuxi (Evan) You'
  },
  {
    name: 'Vue Router',
    url: 'https://github.com/vuejs/router',
    license: 'MIT',
    copyright: 'Copyright (c) 2019-present Eduardo San Martin Morote'
  },
  {
    name: 'Pinia',
    url: 'https://github.com/vuejs/pinia',
    license: 'MIT',
    copyright: 'Copyright (c) 2019-present Eduardo San Martin Morote'
  },
  {
    name: 'Vue I18n',
    url: 'https://github.com/intlify/vue-i18n',
    license: 'MIT',
    copyright: 'Copyright (c) 2020 kazuya kawaguchi'
  },
  {
    name: 'VueUse',
    url: 'https://github.com/vueuse/vueuse',
    license: 'MIT',
    copyright: 'Copyright (c) 2019-PRESENT Anthony Fu'
  },
  {
    name: 'Compressor.js',
    url: 'https://github.com/fengyuanchen/compressorjs',
    license: 'MIT',
    copyright: 'Copyright 2018-present Chen Fengyuan'
  },
  {
    name: 'SVGO',
    url: 'https://github.com/svg/svgo',
    license: 'MIT',
    copyright: 'Copyright (c) Kir Belevich'
  },
  {
    name: 'JSZip',
    url: 'https://github.com/Stuk/jszip',
    license: 'MIT (dual licensed MIT or GPLv3, used under MIT)',
    copyright:
      'Copyright (c) 2009-2016 Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso'
  },
  {
    name: 'Anime.js',
    url: 'https://github.com/juliangarnier/anime',
    license: 'MIT',
    copyright: 'Copyright (c) 2025 Julian Garnier'
  },
  {
    name: 'Odometer',
    url: 'https://github.com/HubSpot/odometer',
    license: 'MIT',
    copyright: 'Copyright (c) 2013 HubSpot, Inc.'
  },
  {
    name: 'vue3-odometer',
    url: 'https://github.com/java0088/vue3-odometer',
    license: 'MIT',
    copyright: 'Copyright (c) huangwantong'
  },
  {
    name: 'Workbox',
    url: 'https://github.com/GoogleChrome/workbox',
    license: 'MIT',
    copyright: 'Copyright 2018 Google LLC'
  },
  {
    name: 'filesize.js',
    url: 'https://github.com/avoidwork/filesize.js',
    license: 'BSD-3-Clause',
    copyright: 'Copyright (c) 2026, Jason Mulligan'
  }
]
</script>

<template>
  <LegalPage :title="t('credits.headline_credits')" :contents-label="t('credits.contents')">
    <p class="lead">{{ t('credits.description_marco') }}</p>
    <p>{{ t('credits.description_open_source') }}</p>

    <section id="image">
      <h2>{{ t('credits.headline_image') }}</h2>
      <ul class="credit-list">
        <li>
          <div class="credit-head">
            <a href="https://unsplash.com/photos/sLAk1guBG90" target="_blank" rel="noopener"
              >Aerial photo of the shoreline</a
            >
            <a href="https://unsplash.com/license" target="_blank" rel="noopener" class="license"
              >Unsplash License</a
            >
          </div>
          <p class="copyright">
            by
            <a href="https://unsplash.com/@sotti" target="_blank" rel="noopener">Shifaaz Shamoon</a>
          </p>
        </li>
      </ul>
    </section>

    <section id="icons">
      <h2>{{ t('credits.headline_icons') }}</h2>
      <ul class="credit-list">
        <li v-for="icon in icons" :key="icon.author">
          <div class="credit-head">
            <a :href="icon.authorUrl" target="_blank" rel="noopener">{{ icon.author }}</a>
            <a href="https://www.flaticon.com/legal" target="_blank" rel="noopener" class="license"
              >Flaticon License</a
            >
          </div>
          <p class="copyright">
            <template v-for="(work, index) in icon.works" :key="work.url"
              ><template v-if="index">, </template
              ><a :href="work.url" target="_blank" rel="noopener">{{ work.name }}</a></template
            >
            on
            <a href="https://www.flaticon.com" target="_blank" rel="noopener">flaticon.com</a>
          </p>
        </li>
      </ul>
    </section>

    <section id="font">
      <h2>{{ t('credits.headline_font') }}</h2>
      <ul class="credit-list">
        <li>
          <div class="credit-head">
            <a href="https://github.com/googlefonts/opensans" target="_blank" rel="noopener"
              >Open Sans</a
            >
            <a
              href="https://openfontlicense.org/open-font-license-official-text/"
              target="_blank"
              rel="noopener"
              class="license"
              >SIL Open Font License 1.1</a
            >
          </div>
          <p class="copyright">Copyright 2020 The Open Sans Project Authors</p>
        </li>
      </ul>
    </section>

    <section id="open-source">
      <h2>{{ t('credits.headline_oss') }}</h2>

      <div class="callout">
        <h3>Ghostscript</h3>
        <p>
          PDF compression is powered by
          <a href="https://www.ghostscript.com" target="_blank" rel="noopener">Ghostscript</a>,
          compiled to WebAssembly. Ghostscript is Copyright (C) Artifex Software, Inc. and is
          licensed under the
          <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener"
            >GNU Affero General Public License v3.0</a
          >. The WebAssembly build (gs.wasm, Ghostscript 10.06) is taken from
          <a href="https://github.com/okathira/ghostpdl-wasm" target="_blank" rel="noopener"
            >@okathira/ghostpdl-wasm</a
          >. The corresponding source code is available in that repository, in the
          <a href="https://github.com/Safi1012/shrink-me" target="_blank" rel="noopener"
            >Shrink Me repository</a
          >
          and from
          <a href="https://www.ghostscript.com/releases/" target="_blank" rel="noopener"
            >ghostscript.com</a
          >.
        </p>
      </div>

      <ul class="credit-list">
        <li v-for="credit in packages" :key="credit.name">
          <div class="credit-head">
            <a :href="credit.url" target="_blank" rel="noopener">{{ credit.name }}</a>
            <span class="license">{{ credit.license }}</span>
          </div>
          <p class="copyright">{{ credit.copyright }}</p>
        </li>
      </ul>
    </section>

    <section id="license-texts">
      <h2>{{ t('credits.headline_license_texts') }}</h2>

      <details>
        <summary>The MIT License (MIT)</summary>
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
      </details>

      <details>
        <summary>BSD 3-Clause License</summary>
        <p>
          Redistribution and use in source and binary forms, with or without modification, are
          permitted provided that the following conditions are met:
        </p>
        <ol>
          <li>
            Redistributions of source code must retain the above copyright notice, this list of
            conditions and the following disclaimer.
          </li>
          <li>
            Redistributions in binary form must reproduce the above copyright notice, this list of
            conditions and the following disclaimer in the documentation and/or other materials
            provided with the distribution.
          </li>
          <li>
            Neither the name of the copyright holder nor the names of its contributors may be used
            to endorse or promote products derived from this software without specific prior written
            permission.
          </li>
        </ol>
        <p>
          THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
          EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
          MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
          COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
          EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
          SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
          HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
          TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
          SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        </p>
      </details>
    </section>
  </LegalPage>
</template>

<style scoped>
.credit-list {
  list-style: none;
  padding: 0;
  border-top: 1px solid #d9e8ea;
}

.credit-list li {
  margin: 0;
  padding: 0.9rem 0;
  border-bottom: 1px solid #d9e8ea;
}

.credit-head {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  align-items: baseline;
  justify-content: space-between;
}

.credit-head > a:first-child {
  font-weight: 600;
  text-decoration: none;
}

.credit-head > a:first-child:hover {
  text-decoration: underline;
}

.license {
  font-size: 0.875rem;
  font-weight: 300;
  color: #6f8184;
}

a.license {
  color: #6f8184;
  text-decoration-color: #d9e8ea;
}

.copyright {
  margin: 0.15rem 0 0;
  font-size: 0.9375rem;
  color: #6f8184;
}

.callout + .credit-list {
  margin-top: 1.5rem;
}

details {
  border-bottom: 1px solid #d9e8ea;
}

details:first-of-type {
  border-top: 1px solid #d9e8ea;
}

summary {
  padding: 0.9rem 0;
  font-weight: 600;
  color: var(--color-shrink-me-secondary);
  cursor: pointer;
}

summary::marker {
  color: var(--color-shrink-me-primary);
}

summary:focus-visible {
  outline: 2px solid var(--color-shrink-me-primary);
  outline-offset: 2px;
}

details p,
details ol {
  font-size: 0.9375rem;
}
</style>
