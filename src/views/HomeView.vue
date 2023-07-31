<script setup lang="ts">
import PageHeader from '@/components/layout/PageHeader.vue'
import PageHero from '@/components/layout/PageHero.vue'
import PageWhat from '@/components/layout/PageWhat.vue'
import PageWhy from '@/components/layout/PageWhy.vue'
import PageFAQ from '@/components/layout/PageFAQ.vue'
import PageFooter from '@/components/layout/PageFooter.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const navItems = [
  {
    title: t('navigation.why'),
    anchor: '#why'
  },
  {
    title: t('navigation.what'),
    anchor: '#what'
  },
  {
    title: t('navigation.faq'),
    anchor: '#faq'
  }
]
</script>

<template>
  <PageHeader :nav-items="navItems" />
  <PageHero />
  <PageWhy />
  <PageWhat />
  <PageFAQ />
  <PageFooter />
</template>
