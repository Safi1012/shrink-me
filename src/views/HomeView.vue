<script setup lang="ts">
import PageHeader from '@/components/layout/PageHeader.vue'
import PageHero from '@/components/layout/PageHero.vue'
import PageWhat from '@/components/layout/PageWhat.vue'
import PageWhy from '@/components/layout/PageWhy.vue'
import PageFAQ from '@/components/layout/PageFAQ.vue'

const navItems = [
  {
    title: 'WHY',
    anchor: '#why'
  },
  {
    title: 'WHAT',
    anchor: '#what'
  },
  {
    title: 'FAQ',
    anchor: '#faq'
  }
]
</script>

<template>
  <header>
    <PageHeader :nav-items="navItems" />
  </header>
  <PageHero />
  <PageWhy />
  <PageWhat />
  <PageFAQ />
</template>
