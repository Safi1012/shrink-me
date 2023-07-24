<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'
import { storeToRefs } from 'pinia'
import { computed, watchEffect, ref } from 'vue'

const borderPath = ref<SVGPathElement | null>(null)
const { width, height, circumference, percentage } = storeToRefs(useProgressStore())

const getViewBox = computed(() => `0 0 ${width.value} ${height.value}`)
const getPath = computed(
  () => `M0,0 L${width.value},0 L${width.value},${height.value} L0,${height.value} L0,0 Z`
)

watchEffect(() => {
  const pathToAnimate = circumference.value - circumference.value * percentage.value

  borderPath.value?.style.setProperty('stroke-dasharray', circumference.value.toString())
  borderPath.value?.style.setProperty('stroke-dashoffset', pathToAnimate.toString())
})
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="getViewBox"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <title>Group</title>
    <desc>Drag and Drop area</desc>

    <defs>
      <path id="path-1" :d="getPath"></path>
      <mask
        id="mask-2"
        maskContentUnits="userSpaceOnUse"
        x="0"
        y="0"
        :width="width"
        :height="height"
        fill="white"
      >
        <use xlink:href="#path-1"></use>
      </mask>
      <path id="path-2" ref="borderPath" class="z-[2]" :d="getPath"></path>
      <mask
        id="mask-4"
        maskContentUnits="userSpaceOnUse"
        x="0"
        y="0"
        :width="width"
        :height="height"
        fill="white"
      >
        <use xlink:href="#path-2"></use>
      </mask>
    </defs>

    <g
      id="Page-1"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
      stroke-dasharray="10"
    >
      <g id="Group" stroke-width="4">
        <use stroke="#e2d7e69e" mask="url(#mask-2)" xlink:href="#path-1"></use>
        <use stroke="#8dd7e0" xlink:href="#path-2"></use>
      </g>

      <foreignObject x="0" y="0" :width="width" :height="height">
        <slot></slot>
      </foreignObject>
    </g>
  </svg>
</template>

<style scoped>
:root {
  --offset: 9999;
}

#path-2 {
  stroke-dasharray: 9999;
  stroke-dashoffset: 9999;
}
</style>
