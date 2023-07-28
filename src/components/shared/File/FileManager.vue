<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useElementBounding, useEventListener } from '@vueuse/core'
import FileSelector from './FileSelector.vue'
import FileCompressor from './FileCompressor.vue'
import FileExporter from './FileExporter.vue'

const FireworkAnimation = defineAsyncComponent(() => import('../FireworkAnimation.vue'))
const el = ref<HTMLElement | null>(null)
const { stage } = storeToRefs(useProgressStore())
const { setDimensions } = useProgressStore()
const { width } = useElementBounding(el)

const updateDimensions = () => {
  const w = Math.floor(width.value)
  const h = Math.floor(width.value / (16 / 9))

  setDimensions(w, h)
}

useEventListener('resize', () => {
  updateDimensions()
})

onMounted(() => {
  updateDimensions()
})
</script>

<template>
  <div ref="el">
    <FireworkAnimation v-if="stage === 2 && el" :draw-area="el" />

    <FileSelector v-if="stage === 0" />
    <FileCompressor v-if="stage === 1" />
    <FileExporter v-if="stage === 2" />
  </div>
</template>
