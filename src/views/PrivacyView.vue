<script setup lang="ts">
import PageFooter from '@/components/layout/PageFooter.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
</script>

<template>
  <PageHeader />

  <article
    lang="en"
    class="grid auto-rows-[minmax(2em,auto)] grid-cols-[repeat(12,1fr)] justify-items-stretch gap-[2em_0.75em]"
  >
    <section class="mt-16">
      <h1 class="mb-4">{{ $t('privacy.headline_privacy') }}</h1>
      <p>
        {{ $t('privacy.description_privacy_1') }}
      </p>

      <p>
        {{ $t('privacy.description_privacy_2') }}
      </p>

      <p>
        {{ $t('privacy.description_privacy_3') }}
      </p>

      <p>{{ $t('privacy.description_privacy_4') }}</p>
      <ol>
        <li>
          <p>{{ $t('privacy.description_privacy_list_item_1') }}</p>
        </li>
        <li>
          <p>{{ $t('privacy.description_privacy_list_item_2') }}</p>
        </li>
        <li>
          <p>{{ $t('privacy.description_privacy_list_item_3') }}</p>
        </li>
      </ol>

      <section class="mt-16">
        <h2 class="mb-4">{{ $t('privacy.headline_controller') }}</h2>
        <p>
          {{ $t('privacy.description_controller') }}
        </p>
        <p class="center">
          {{ $t('privacy.address_name') }} <br />
          {{ $t('privacy.address_street') }} <br />
          {{ $t('privacy.address_city') }} <br />
          {{ $t('privacy.address_country') }} <br /><br />
          <a
            href="mailto:mail@shrinkme.app"
            class="text-base font-light text-[#48bfcd] no-underline"
            >mail@shrinkme.app</a
          >
        </p>
      </section>

      <section class="mt-16">
        <h2 class="mb-4">{{ $t('privacy.headline_rights') }}</h2>
        <p>
          {{ $t('privacy.description_rights_1') }}
        </p>
        <ul>
          <li>
            <p>
              {{ $t('privacy.description_rights_list_item_1') }}
            </p>
          </li>
        </ul>

        <ul>
          <li>
            <p>{{ $t('privacy.description_rights_list_item_2') }}</p>
          </li>
        </ul>

        <ul>
          <li>
            <p></p>
            <p>{{ $t('privacy.description_rights_list_item_3') }}</p>
          </li>
        </ul>

        <ul>
          <li>
            <p></p>
            <p>{{ $t('privacy.description_rights_list_item_4') }}</p>
          </li>
        </ul>

        <ul>
          <li>
            <p></p>
            <p>{{ $t('privacy.description_rights_list_item_5') }}</p>
          </li>
        </ul>

        <p>
          {{ $t('privacy.description_rights_2') }}
        </p>
        <p>
          {{ $t('privacy.description_rights_3') }}
        </p>
      </section>

      <section class="mt-16">
        <h3 class="mb-4">{{ $t('privacy.headline_data_processing') }}</h3>
        <p>
          {{ $t('privacy.description_data_processing_1') }}
        </p>
        <p>
          <br />
          {{ $t('privacy.description_data_processing_2') }}
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

section {
  grid-area: c;
}

.center {
  text-align: center;
}

p {
  @apply text-justify;
}

ul,
p {
  @apply mb-4;
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
