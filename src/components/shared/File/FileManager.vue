<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'
import FileSelector from './FileSelector.vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useElementBounding, useEventListener } from '@vueuse/core'
import FileCompressor from './FileCompressor.vue'
import FileExporter from './FileExporter.vue'

const el = ref(null)
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
    <FileSelector v-if="stage === 0" />
    <FileCompressor v-if="stage === 1" />
    <FileExporter v-if="stage === 2" />
  </div>
</template>
