<template>
  <div v-if="compressedImages || savedBytes.value">
    <p class="inline-flex flex-row items-end justify-center text-[#9b9b9b]">
      Shrink Me compressed
      <RollingNumber
        :value="compressedImages"
        class="mx-2 text-3xl font-normal text-[rgba(72,191,205,0.5)]"
      />
      files
    </p>

    <p
      v-if="innerWidth >= 992"
      class="inline-flex flex-row items-end justify-center text-[#9b9b9b]"
    >
      &nbsp;and saved
      <RollingNumber
        :value="savedBytes.value"
        class="mx-2 text-3xl font-normal text-[rgba(72,191,205,0.5)]"
      />
      {{ savedBytes.symbol }}
      of storage
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RollingNumber from '@/components/shared/RollingNumber.vue'
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
.rolling-number {
  line-height: 0.9em;
}
</style>
