<script setup lang="ts">
import PageHeader from '@/components/layout/PageHeader.vue'
import PageHero from '@/components/layout/PageHero.vue'

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
    <PageHero />
  </header>
</template>
