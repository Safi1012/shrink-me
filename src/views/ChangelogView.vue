<script setup lang="ts">
import LegalPage from '@/components/layout/LegalPage.vue'
import { releases } from '@/changelog'
import { useI18n } from 'vue-i18n'
import { version } from '../../package.json'

const { t, locale } = useI18n()

// The headings release-please writes, see `changelog-sections` in its config
const sectionKeys: Record<string, string> = {
  '⚠ BREAKING CHANGES': 'breaking',
  Features: 'features',
  'Bug Fixes': 'fixes',
  'Performance Improvements': 'performance',
  Reverts: 'reverts'
}

const sectionTitle = (title: string) => {
  const key = sectionKeys[title]
  return key ? t(`changelog.sections.${key}`) : title
}

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(locale.value, { dateStyle: 'long' })
</script>

<template>
  <LegalPage
    :title="t('changelog.headline')"
    :contents-label="t('changelog.versions')"
    :content-key="locale"
  >
    <template #band>
      <p class="current">{{ t('changelog.current', { version }) }}</p>
    </template>

    <p class="lead">{{ t('changelog.description') }}</p>

    <section v-for="release in releases" :id="`v${release.version}`" :key="release.version">
      <h2>
        <span class="title">{{ release.version }}</span>
      </h2>
      <p v-if="release.date" class="note">
        <time :datetime="release.date">{{ formatDate(release.date) }}</time>
      </p>

      <template v-for="section in release.sections" :key="section.title">
        <h3>{{ sectionTitle(section.title) }}</h3>
        <ul lang="en">
          <li v-for="entry in section.entries" :key="entry.text">
            <strong v-if="entry.scope">{{ entry.scope }}: </strong>{{ entry.text }}
          </li>
        </ul>
      </template>
    </section>
  </LegalPage>
</template>

<style scoped>
.current {
  margin-top: 1rem;
  font-size: 1.125rem;
  font-weight: 300;
}
</style>
