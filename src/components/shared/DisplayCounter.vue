<template>
  <div v-if="compressedImages || savedBytes.value">
    <p class="inline-flex flex-row items-end justify-center text-[#9b9b9b]">
      Shrink Me compressed
      <IOdometer
        :value="compressedImages"
        class="rgba(#48bfcd, 0.5) mx-2 text-3xl leading-[0.8em] font-normal text-[rgba(72,191,205,0.5)]"
      ></IOdometer>
      files
    </p>

    <p
      v-if="innerWidth >= 992"
      class="inline-flex flex-row items-end justify-center text-[#9b9b9b]"
    >
      &nbsp;and saved
      <IOdometer
        :value="savedBytes.value"
        format="( ddd),dd"
        class="mx-2 text-3xl leading-[0.8em] font-normal text-[rgba(72,191,205,0.5)]"
      />
      {{ savedBytes.symbol }}
      of storage
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IOdometer from 'vue3-odometer'
import 'odometer/themes/odometer-theme-default.css'
import { filesize } from 'filesize'
import { useCounter } from '@/counter'

defineProps<{ innerWidth: number }>()

const totals = useCounter()

const compressedImages = computed(() => totals.value?.compressedImages ?? 0)

const savedBytes = computed(() => {
  if (!totals.value) return { value: 0, symbol: '' }

  const file = filesize(totals.value.savedBytes, { round: 2, output: 'object' })
  return { symbol: file.symbol, value: Number(file.value) }
})
</script>

<style scoped>
.odometer.odometer-theme-default {
  line-height: 0.9em;
}
</style>
